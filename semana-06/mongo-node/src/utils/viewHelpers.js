// Funciones disponibles en todas las vistas EJS (se registran en app.locals)

export const authorName = (user) =>
    user ? `${user.name} ${user.lastName}` : "Usuario desconocido";

export const initials = (user) =>
    user ? `${(user.name || "?")[0]}${(user.lastName || "")[0] || ""}`.toUpperCase() : "?";

export const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })
        : "—";

// Minutos de lectura estimados (200 palabras por minuto, mínimo 1)
export const readTime = (post) => {
    const words = String(post.content || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
};

export const excerpt = (text, max = 110) => {
    const clean = String(text || "").trim();
    return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
};
