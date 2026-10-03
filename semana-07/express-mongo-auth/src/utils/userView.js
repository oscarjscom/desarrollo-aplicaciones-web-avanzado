import { calcAge, toDateOnly } from '../shared/rules.js';

// Forma pública de un usuario: lo único que sale del servidor (nunca la contraseña).
export default function toPublicUser(user) {
    const birthdate = user.birthdate ? new Date(user.birthdate) : null;
    return {
        id: user._id,
        email: user.email,
        name: user.name || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        birthdate: birthdate ? toDateOnly(birthdate) : '',
        age: birthdate ? calcAge(birthdate) : null,
        url_profile: user.url_profile || '',
        address: user.address || '',
        roles: (user.roles || []).map((r) => (typeof r === 'object' && r ? r.name : r)).filter(Boolean),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}
