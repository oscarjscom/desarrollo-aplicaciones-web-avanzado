import postService from "../services/postService.js";

class PostController {
    async create(req, res) {
        try {
            const { userId } = req.params;
            const post = await postService.createPost(userId, req.body);
            res.status(201).json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            console.log(posts);
            res.render("posts", { posts }); // Renderiza la vista posts.ejs
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new PostController();
