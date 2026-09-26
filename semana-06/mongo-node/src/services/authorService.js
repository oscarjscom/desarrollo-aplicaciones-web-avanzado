import postRepository from "../repositories/postRepository.js";
import userRepository from "../repositories/userRepository.js";

const PAGE_SIZE = 8;

const notFound = (message) => {
    const error = new Error(message);
    error.status = 404;
    return error;
};

const countWords = (text) => String(text || "").trim().split(/\s+/).filter(Boolean).length;
const byNewest = (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0);

const monthLabel = (date) => {
    const label = new Date(date || 0).toLocaleDateString("es-PE", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
};

class AuthorService {
    // Todos los autores con la cantidad de publicaciones de cada uno
    async listAuthors() {
        const [users, posts] = await Promise.all([userRepository.findAll(), postRepository.findAll()]);
        return users.map((user) => ({
            user,
            postCount: posts.filter((p) => p.user && String(p.user._id) === String(user._id)).length
        }));
    }

    // Todo lo necesario para dibujar la página de perfil de un autor
    async getProfile(userId, { q = "", tema = "", page = 1 } = {}) {
        const author = await userRepository.findById(userId);
        if (!author) throw notFound("Autor no encontrado");

        const [authored, authors] = await Promise.all([postRepository.findByUser(userId), this.listAuthors()]);
        const posts = [...authored].sort(byNewest);

        // Temas: los hashtags del autor y cuántas veces los usa
        const topicCount = new Map();
        posts.forEach((p) => (p.hashtags || []).forEach((t) => topicCount.set(t, (topicCount.get(t) || 0) + 1)));
        const topics = [...topicCount.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

        const totalWords = posts.reduce((sum, p) => sum + countWords(p.content), 0);
        const stats = {
            posts: posts.length,
            topics: topics.length,
            minutes: posts.length ? Math.max(1, Math.ceil(totalWords / 200)) : 0
        };
        const memberSince = author.createdAt || author._id.getTimestamp();

        // Destacadas: la más reciente, la más completa y la que cubre más temas
        const featured = [];
        const addFeatured = (post, reason) => {
            if (post && !featured.some((f) => String(f.post._id) === String(post._id))) featured.push({ post, reason });
        };
        addFeatured(posts[0], "La más reciente");
        addFeatured([...posts].sort((a, b) => countWords(b.content) - countWords(a.content))[0], "La más completa");
        addFeatured([...posts].sort((a, b) => (b.hashtags || []).length - (a.hashtags || []).length)[0], "La que cubre más temas");
        posts.forEach((p) => { if (featured.length < 3) addFeatured(p, "Destacada"); });

        // Filtros de la lista completa
        const term = q.trim().toLowerCase();
        let filtered = posts;
        if (tema) filtered = filtered.filter((p) => (p.hashtags || []).includes(tema));
        if (term) {
            filtered = filtered.filter((p) =>
                [p.title, p.content, (p.hashtags || []).join(" ")].join(" ").toLowerCase().includes(term)
            );
        }

        // Paginación numerada
        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        const currentPage = Math.min(Math.max(1, page), totalPages);
        const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

        // Agrupadas por mes y año (las más nuevas primero)
        const groups = [];
        pageItems.forEach((post) => {
            const label = monthLabel(post.createdAt);
            const last = groups[groups.length - 1];
            if (last && last.label === label) last.posts.push(post);
            else groups.push({ label, posts: [post] });
        });

        return {
            author,
            stats,
            memberSince,
            featured,
            topics,
            groups,
            pagination: { page: currentPage, totalPages, total: filtered.length },
            filters: { q, tema },
            others: authors.filter((a) => String(a.user._id) !== String(author._id))
        };
    }
}

export default new AuthorService();
