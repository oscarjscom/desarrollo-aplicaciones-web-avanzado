import authService from '../services/AuthService.js';
import roleRepository from '../repositories/RoleRepository.js';
import userRepository from '../repositories/UserRepository.js';

// Crea el primer administrador si todavía no existe ninguno.
// Sus datos salen del .env, para que la contraseña nunca quede escrita en el código.
export default async function seedUsers() {
    const adminRole = await roleRepository.findByName('admin');
    if (adminRole && (await userRepository.countByRole(adminRole._id)) > 0) return;

    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.warn('Seed: no hay administrador. Define ADMIN_EMAIL y ADMIN_PASSWORD en el .env para crearlo.');
        return;
    }

    try {
        const admin = await authService.signUp({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            name: process.env.ADMIN_NAME || 'Administrador',
            lastName: process.env.ADMIN_LASTNAME || 'Principal',
            phoneNumber: process.env.ADMIN_PHONE || '+51 999 999 999',
            birthdate: process.env.ADMIN_BIRTHDATE || '1990-01-01'
        }, { roles: ['user', 'admin'] });
        console.log(`Seeded admin: ${admin.email}`);
    } catch (err) {
        // El admin pasa por las mismas validaciones que cualquier registro
        console.error('Seed: no se pudo crear el administrador:', err.message, err.errors || '');
    }
}
