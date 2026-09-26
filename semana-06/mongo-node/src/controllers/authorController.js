import authorService from "../services/authorService.js";

const asText = (value) => (typeof value === "string" ? value : "");

class AuthorController {
    async list(req, res) {
        try {
            const authors = await authorService.listAuthors();
            res.render("authors", { authors });
        } catch (error) {
            res.status(500).render("error", { message: error.message });
        }
    }

    async profile(req, res) {
        try {
            const profile = await authorService.getProfile(req.params.id, {
                q: asText(req.query.q),
                tema: asText(req.query.tema),
                page: parseInt(req.query.page, 10) || 1
            });
            res.render("author", profile);
        } catch (error) {
            if (error.status === 404 || error.name === "CastError") {
                return res.status(404).render("error", { message: "Autor no encontrado" });
            }
            res.status(500).render("error", { message: error.message });
        }
    }
}

export default new AuthorController();
