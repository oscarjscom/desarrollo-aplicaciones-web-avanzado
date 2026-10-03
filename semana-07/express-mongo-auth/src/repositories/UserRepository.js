import User from '../models/User.js';

// Por defecto nunca se devuelve la contraseña cifrada fuera de esta capa.
const HIDE_PASSWORD = '-password';

class UserRepository {
    async create(userData) {
        const user = new User(userData);
        return user.save();
    }

    async findByEmail(email) {
        return User.findOne({ email }).select(HIDE_PASSWORD).populate('roles').exec();
    }

    // Único método que trae la contraseña: solo para comparar con bcrypt al iniciar sesión.
    async findByEmailWithPassword(email) {
        return User.findOne({ email }).populate('roles').exec();
    }

    async findById(id) {
        return User.findById(id).select(HIDE_PASSWORD).populate('roles').exec();
    }

    async findByIdWithPassword(id) {
        return User.findById(id).exec();
    }

    async emailExists(email, exceptId) {
        const filter = exceptId ? { email, _id: { $ne: exceptId } } : { email };
        return (await User.exists(filter)) !== null;
    }

    async updateProfile(id, data) {
        return User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .select(HIDE_PASSWORD).populate('roles').exec();
    }

    async updatePassword(id, hashedPassword) {
        return User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).select(HIDE_PASSWORD).exec();
    }

    async getAll() {
        return User.find().select(HIDE_PASSWORD).populate('roles').sort({ createdAt: -1 }).exec();
    }

    async countByRole(roleId) {
        return User.countDocuments({ roles: roleId }).exec();
    }
}

export default new UserRepository();
