import postRepository from "../repositories/postRepository.js";
import userRepository from "../repositories/userRepository.js";

// Convierte "#node, express  mongo" (o un arreglo) en ["node", "express", "mongo"]
const parseHashtags = (value) => {
    const list = Array.isArray(value) ? value : String(value || "").split(/[\s,]+/);
    return list.map((tag) => String(tag).replace(/^#+/, "").trim()).filter(Boolean);
};

const notFound = (message) => {
    const error = new Error(message);
    error.status = 404;
    return error;
};

class PostService {
    async createPost(userId, postData) {
        if (!userId) throw new Error("Debes elegir un autor");

        const user = await userRepository.findById(userId);
        if (!user) throw new Error("Usuario no encontrado");

        return await postRepository.create({
            title: postData.title,
            content: postData.content,
            hashtags: parseHashtags(postData.hashtags),
            imageUrl: postData.imageUrl,
            user: user._id
        });
    }

    async updatePost(postId, postData) {
        const post = await postRepository.update(postId, {
            title: postData.title,
            content: postData.content,
            hashtags: parseHashtags(postData.hashtags),
            imageUrl: postData.imageUrl,
            updatedAt: new Date()
        });
        if (!post) throw notFound("Post no encontrado");
        return post;
    }

    async deletePost(postId) {
        const post = await postRepository.delete(postId);
        if (!post) throw notFound("Post no encontrado");
        return post;
    }

    async getPosts() {
        return await postRepository.findAll();
    }

    async getPostById(postId) {
        const post = await postRepository.findById(postId);
        if (!post) throw notFound("Post no encontrado");
        return post;
    }

    async getPostsByUser(userId) {
        return await postRepository.findByUser(userId);
    }

    async getAuthors() {
        return await userRepository.findAll();
    }
}

export default new PostService();
