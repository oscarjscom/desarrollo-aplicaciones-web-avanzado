import User from "../models/User.js";

class UserRepository {
    async create(user) {
        return await User.create(user);
    }

    // Nunca se devuelve la contraseña al resto de la aplicación
    async findAll() {
        return await User.find().select("-password");
    }

    async findById(id) {
        return await User.findById(id).select("-password");
    }
}

export default new UserRepository();
