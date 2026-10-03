import mongoose from 'mongoose';
import { LIMITS } from '../shared/rules.js';

// El esquema es la última capa de validación: aunque el servicio ya validó todo,
// la base de datos tampoco acepta datos fuera de estas reglas.
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: LIMITS.emailMax
    },
    password: {
        // Aquí se guarda el hash de bcrypt (60 caracteres); las reglas de la contraseña
        // en texto plano se validan en el servicio, antes de cifrarla.
        type: String,
        required: true,
        minlength: 60
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: LIMITS.nameMin,
        maxlength: LIMITS.nameMax
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true,
        minlength: LIMITS.nameMin,
        maxlength: LIMITS.nameMax
    },
    phoneNumber: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        trim: true,
        match: [/^\+?[0-9][0-9 -]*[0-9]$/, 'Teléfono no válido']
    },
    birthdate: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria'],
        validate: {
            validator: (value) => value instanceof Date && value.getTime() <= Date.now(),
            message: 'La fecha de nacimiento no puede estar en el futuro'
        }
    },
    url_profile: {
        type: String,
        trim: true,
        maxlength: LIMITS.urlMax,
        match: [/^$|^https?:\/\/.+/i, 'La URL debe empezar con http:// o https://']
    },
    address: {
        type: String,
        trim: true,
        maxlength: LIMITS.addressMax
    }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
