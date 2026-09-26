import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: [5, "El título debe tener al menos 5 caracteres"],
        maxlength: [30, "El título no puede superar los 30 caracteres"],
        required: [true, "El título es obligatorio"]
    },
    content: {
        type: String,
        trim: true,
        minlength: [10, "El contenido debe tener al menos 10 caracteres"],
        required: [true, "El contenido es obligatorio"]
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hashtags: [String],
    imageUrl: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/i, "La URL de la imagen debe empezar con http:// o https://"]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

export default mongoose.model("Post", postSchema);
