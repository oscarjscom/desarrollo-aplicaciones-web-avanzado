import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: [true, 'El correo es obligatorio'], unique: true, lowercase: true, trim: true, maxlength: 254 }
}, { timestamps: true });

// mongoose.model() define el nombre de la colección: "users"
export default mongoose.model('User', userSchema);
