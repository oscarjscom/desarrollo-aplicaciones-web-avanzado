import postService from "../services/postService.js";

// Devuelve la lista de mensajes de error para mostrar en el formulario
const errorMessages = (error) => {
    if (error.name === "ValidationError") {
        return Object.values(error.errors).map((e) => e.message);
    }
    if (error.name === "CastError") return ["Identificador no válido"];
    return [error.message];
};

const isNotFound = (error) => error.status === 404 || error.name === "CastError";

const renderError = (res, status, message) =>
    res.status(status).render("error", { message });

class PostController {
    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            res.render("posts", { posts });
        } catch (error) {
            renderError(res, 500, error.message);
        }
    }

    async newForm(req, res) {
        try {
            const authors = await postService.getAuthors();
            res.render("postForm", { post: {}, authors, errors: [], isEdit: false });
        } catch (error) {
            renderError(res, 500, error.message);
        }
    }

    async create(req, res) {
        try {
            await postService.createPost(req.body.userId, req.body);
            res.redirect("/posts");
        } catch (error) {
            const authors = await postService.getAuthors();
            res.status(400).render("postForm", {
                post: req.body,
                authors,
                errors: errorMessages(error),
                isEdit: false
            });
        }
    }

    async editForm(req, res) {
        try {
            const post = await postService.getPostById(req.params.id);
            res.render("postForm", { post, authors: [], errors: [], isEdit: true });
        } catch (error) {
            renderError(res, isNotFound(error) ? 404 : 500, isNotFound(error) ? "Post no encontrado" : error.message);
        }
    }

    async update(req, res) {
        const { id } = req.params;
        try {
            await postService.updatePost(id, req.body);
            res.redirect("/posts");
        } catch (error) {
            if (isNotFound(error)) return renderError(res, 404, "Post no encontrado");
            res.status(400).render("postForm", {
                post: { ...req.body, _id: id },
                authors: [],
                errors: errorMessages(error),
                isEdit: true
            });
        }
    }

    async remove(req, res) {
        try {
            await postService.deletePost(req.params.id);
            res.redirect("/posts");
        } catch (error) {
            renderError(res, isNotFound(error) ? 404 : 500, isNotFound(error) ? "Post no encontrado" : error.message);
        }
    }
}

export default new PostController();
