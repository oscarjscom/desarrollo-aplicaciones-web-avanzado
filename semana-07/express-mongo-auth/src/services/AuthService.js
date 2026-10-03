import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import { validateSignUp, validators, normalizeEmail } from '../shared/rules.js';
import { badRequest, conflict, unauthorized } from '../utils/httpErrors.js';
import toPublicUser from '../utils/userView.js';

const saltRounds = () => parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);

class AuthService {

    // Registro público: siempre crea usuarios con el rol "user".
    // Los roles que vengan en el cuerpo se ignoran, así nadie puede registrarse como admin.
    async signUp(data = {}, { roles = ['user'] } = {}) {
        const { errors, values, valid } = validateSignUp(data);
        if (!valid) throw badRequest(errors);

        if (await userRepository.emailExists(values.email)) {
            throw conflict('El email ya se encuentra en uso', { email: 'Este correo ya está registrado' });
        }

        // La contraseña se valida en texto plano (arriba) y recién después se cifra
        const hashed = await bcrypt.hash(values.password, saltRounds());

        const roleDocs = [];
        for (const r of roles) {
            let roleDoc = await roleRepository.findByName(r);
            if (!roleDoc) roleDoc = await roleRepository.create({ name: r });
            roleDocs.push(roleDoc._id);
        }

        const { password, ...profile } = values;
        const user = await userRepository.create({ ...profile, password: hashed, roles: roleDocs });
        return toPublicUser(await user.populate('roles'));
    }

    async signIn(data = {}) {
        const { email, password } = data;
        const errors = {};
        const emailError = typeof email === 'string' ? validators.email(email) : 'El correo es obligatorio';
        if (emailError) errors.email = emailError;
        if (typeof password !== 'string' || !password) errors.password = 'La contraseña es obligatoria';
        if (Object.keys(errors).length) throw badRequest(errors, 'El email y password son requeridos');

        const user = await userRepository.findByEmailWithPassword(normalizeEmail(email));
        // Mismo mensaje si el correo no existe o si la contraseña falla: no se revela cuál de los dos
        if (!user || !(await bcrypt.compare(password, user.password))) throw unauthorized();

        const token = jwt.sign(
            { sub: user._id, roles: user.roles.map(r => r.name), name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        return { token };
    }

    // Validación asíncrona del formulario: ¿el correo ya está registrado?
    async isEmailAvailable(email) {
        if (typeof email !== 'string') throw badRequest({ email: 'Formato inválido' });
        const message = validators.email(email);
        if (message) throw badRequest({ email: message });
        return !(await userRepository.emailExists(normalizeEmail(email)));
    }
}

export default new AuthService();
