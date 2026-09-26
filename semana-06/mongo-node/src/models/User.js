import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    email: { type: String, unique: true },
    age: {
        type: Number,
        min: [18, "La edad mínima es 18 años"],
        required: [true, "La edad es obligatoria"]
    },
    phoneNumber: String,
    password: {
        type: String,
        minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
        required: [true, "La contraseña es obligatoria"]
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
