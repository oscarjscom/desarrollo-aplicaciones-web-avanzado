import Post from "../models/Post.js";

class PostRepository {
    async create(post) {
        return await Post.create(post);
    }

    async findAll() {
        return await Post.find().populate("user", "-password");
    }

    async findById(postId) {
        return await Post.findById(postId).populate("user", "-password");
    }

    async findByUser(userId) {
        return await Post.find({ user: userId }).populate("user", "-password");
    }

    async update(postId, postData) {
        return await Post.findByIdAndUpdate(postId, postData, {
            new: true,           // devuelve el post actualizado en vez del antiguo
            runValidators: true  // aplica las restricciones del esquema también al actualizar
        });
    }

    async delete(postId) {
        return await Post.findByIdAndDelete(postId);
    }
}

export default new PostRepository();
