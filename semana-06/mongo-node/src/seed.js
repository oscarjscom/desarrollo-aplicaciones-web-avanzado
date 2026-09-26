import mongoose from "mongoose";
import connectDB from "./db/database.js";
import User from "./models/User.js";

// Crea un usuario de ejemplo que cumple las restricciones del esquema (age >= 18, password >= 8)
await connectDB();

const email = "oscar@ejemplo.com";
const existing = await User.findOne({ email });

if (existing) {
    console.log("El usuario de ejemplo ya existe:", existing.email);
} else {
    const user = await User.create({
        name: "Oscar",
        lastName: "Olano",
        email,
        age: 22,
        phoneNumber: "+51 999999999",
        password: "password123"
    });
    console.log("Usuario de ejemplo creado:", user);
}

await mongoose.disconnect();
