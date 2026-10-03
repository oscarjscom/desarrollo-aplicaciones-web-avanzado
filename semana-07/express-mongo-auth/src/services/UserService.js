import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import userRepository from '../repositories/UserRepository.js';
import { validateProfile, validateNewPassword } from '../shared/rules.js';
import { badRequest, conflict, notFound } from '../utils/httpErrors.js';
import toPublicUser from '../utils/userView.js';

const ensureValidId = (id) => {
    if (!mongoose.isValidObjectId(id)) throw notFound('Usuario no encontrado');
};

class UserService {

    async getAll() {
        const users = await userRepository.getAll();
        return users.map(toPublicUser);
    }

    async getById(id) {
        ensureValidId(id);
        const user = await userRepository.findById(id);
        if (!user) throw notFound('Usuario no encontrado');
        return toPublicUser(user);
    }

    // Solo se pueden cambiar estos campos: roles y contraseña quedan fuera aunque vengan en el cuerpo
    async updateProfile(id, data = {}) {
        ensureValidId(id);
        const { errors, values, valid } = validateProfile(data);
        if (!valid) throw badRequest(errors);

        if (await userRepository.emailExists(values.email, id)) {
            throw conflict('El email ya se encuentra en uso', { email: 'Este correo ya está registrado' });
        }

        const user = await userRepository.updateProfile(id, values);
        if (!user) throw notFound('Usuario no encontrado');
        return toPublicUser(user);
    }

    async changePassword(id, data = {}) {
        ensureValidId(id);
        const { currentPassword, newPassword } = data;
        const errors = {};
        if (typeof currentPassword !== 'string' || !currentPassword) errors.currentPassword = 'Escribe tu contraseña actual';
        if (typeof newPassword !== 'string') errors.newPassword = 'La contraseña es obligatoria';
        if (Object.keys(errors).length) throw badRequest(errors);

        const user = await userRepository.findByIdWithPassword(id);
        if (!user) throw notFound('Usuario no encontrado');

        const { errors: ruleErrors, valid } = validateNewPassword({ newPassword }, { email: user.email, name: user.name });
        if (!valid) throw badRequest({ newPassword: ruleErrors.password });

        if (!(await bcrypt.compare(currentPassword, user.password))) {
            throw badRequest({ currentPassword: 'La contraseña actual no es correcta' });
        }
        if (await bcrypt.compare(newPassword, user.password)) {
            throw badRequest({ newPassword: 'La nueva contraseña debe ser distinta de la actual' });
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        await userRepository.updatePassword(id, await bcrypt.hash(newPassword, saltRounds));
        return { message: 'Contraseña actualizada' };
    }
}

export default new UserService();
