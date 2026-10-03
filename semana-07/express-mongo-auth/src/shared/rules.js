// Reglas de validación compartidas: las usa el navegador y también el servidor,
// así ambas validaciones son idénticas. No debe importar nada de Node.

export const LIMITS = {
    nameMin: 2,
    nameMax: 50,
    emailMax: 254,
    passwordMin: 8,
    passwordMax: 64,   // bcrypt solo usa los primeros 72 bytes
    phoneDigitsMin: 7,
    phoneDigitsMax: 15, // máximo del estándar internacional E.164
    addressMax: 120,
    urlMax: 300,
    minAge: 13,
    maxAge: 120
};

export const PASSWORD_SPECIALS = '#$%&*@';

const NAME_RE = /^[\p{L}](?:[\p{L}' -]*[\p{L}])?$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9 -]*[0-9]$/;
const ADDRESS_RE = /^[\p{L}0-9 .,#°º\-/()]+$/u;

// Reglas de la contraseña, una por una (sirven para la lista que se va marcando).
export const PASSWORD_RULES = [
    { id: 'length', label: `Entre ${LIMITS.passwordMin} y ${LIMITS.passwordMax} caracteres`,
      test: (v) => v.length >= LIMITS.passwordMin && v.length <= LIMITS.passwordMax },
    { id: 'upper', label: 'Al menos una letra mayúscula', test: (v) => /\p{Lu}/u.test(v) },
    { id: 'digit', label: 'Al menos un número', test: (v) => /[0-9]/.test(v) },
    { id: 'special', label: `Al menos un carácter especial (${PASSWORD_SPECIALS.split('').join(' ')})`,
      test: (v) => /[#$%&*@]/.test(v) },
    { id: 'spaces', label: 'Sin espacios', test: (v) => v.length > 0 && !/\s/.test(v) }
];

/* ---------- Normalización ---------- */
export const collapseSpaces = (v) => String(v).trim().replace(/\s+/g, ' ');
export const normalizeEmail = (v) => String(v).trim().toLowerCase();

/* ---------- Fechas y edad ---------- */
// Convierte "AAAA-MM-DD" en una fecha UTC, o null si no es una fecha real (p. ej. 2023-02-30).
export function parseDateOnly(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
    if (!m) return null;
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const date = new Date(Date.UTC(y, mo - 1, d));
    if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null;
    return date;
}

export function toDateOnly(date) {
    if (!date) return '';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
}

export function calcAge(birthdate, now = new Date()) {
    const b = birthdate instanceof Date ? birthdate : parseDateOnly(birthdate);
    if (!b) return null;
    let age = now.getUTCFullYear() - b.getUTCFullYear();
    const beforeBirthday =
        now.getUTCMonth() < b.getUTCMonth() ||
        (now.getUTCMonth() === b.getUTCMonth() && now.getUTCDate() < b.getUTCDate());
    if (beforeBirthday) age -= 1;
    return age;
}

// Límites para el selector de fecha (atributos min y max del <input type="date">).
export function birthdateBounds(now = new Date()) {
    const shift = (years) => toDateOnly(new Date(Date.UTC(now.getUTCFullYear() - years, now.getUTCMonth(), now.getUTCDate())));
    return { min: shift(LIMITS.maxAge + 1), max: shift(LIMITS.minAge) };
}

/* ---------- Validadores de un campo (devuelven el mensaje de error o null) ---------- */
const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

export const validators = {
    name(value, label = 'El nombre') {
        if (isBlank(value)) return `${label} es obligatorio`;
        const v = collapseSpaces(value);
        if (v.length < LIMITS.nameMin) return `${label} debe tener al menos ${LIMITS.nameMin} letras`;
        if (v.length > LIMITS.nameMax) return `${label} no puede superar los ${LIMITS.nameMax} caracteres`;
        if (!NAME_RE.test(v)) return `${label} solo puede tener letras, espacios, guiones y apóstrofos`;
        return null;
    },

    lastName(value) {
        return validators.name(value, 'El apellido');
    },

    email(value) {
        if (isBlank(value)) return 'El correo es obligatorio';
        const v = normalizeEmail(value);
        if (v.length > LIMITS.emailMax) return `El correo no puede superar los ${LIMITS.emailMax} caracteres`;
        if (!EMAIL_RE.test(v)) return 'Escribe un correo válido, por ejemplo nombre@dominio.com';
        return null;
    },

    phoneNumber(value) {
        if (isBlank(value)) return 'El teléfono es obligatorio';
        const v = collapseSpaces(value);
        if (!PHONE_RE.test(v)) return 'Usa solo números, espacios, guiones y un "+" inicial';
        const digits = v.replace(/\D/g, '').length;
        if (digits < LIMITS.phoneDigitsMin || digits > LIMITS.phoneDigitsMax)
            return `El teléfono debe tener entre ${LIMITS.phoneDigitsMin} y ${LIMITS.phoneDigitsMax} dígitos`;
        return null;
    },

    birthdate(value, now = new Date()) {
        if (isBlank(value)) return 'La fecha de nacimiento es obligatoria';
        const date = parseDateOnly(value);
        if (!date) return 'Escribe una fecha válida';
        if (date.getTime() > now.getTime()) return 'La fecha de nacimiento no puede estar en el futuro';
        const age = calcAge(date, now);
        if (age < LIMITS.minAge) return `Debes tener al menos ${LIMITS.minAge} años`;
        if (age > LIMITS.maxAge) return 'Revisa el año: la edad no puede superar los 120 años';
        return null;
    },

    url_profile(value) {
        if (isBlank(value)) return null; // opcional
        const v = String(value).trim();
        if (v.length > LIMITS.urlMax) return `La URL no puede superar los ${LIMITS.urlMax} caracteres`;
        let url;
        try { url = new URL(v); } catch { return 'Escribe una URL completa, por ejemplo https://...'; }
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'La URL debe empezar con http:// o https://';
        return null;
    },

    address(value) {
        if (isBlank(value)) return null; // opcional
        const v = collapseSpaces(value);
        if (v.length > LIMITS.addressMax) return `La dirección no puede superar los ${LIMITS.addressMax} caracteres`;
        if (!ADDRESS_RE.test(v)) return 'La dirección tiene caracteres no permitidos';
        return null;
    },

    password(value, context = {}) {
        if (isBlank(value)) return 'La contraseña es obligatoria';
        const v = String(value);
        const failed = PASSWORD_RULES.find((rule) => !rule.test(v));
        if (failed) return `La contraseña no cumple: ${failed.label.toLowerCase()}`;
        // Regla cruzada: no debe contener datos personales fáciles de adivinar
        // Se comparan sin tildes ni mayúsculas: "AnaMaria#1" también contiene "Ana María"
        const plain = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
        const lower = plain(v);
        const emailUser = context.email ? plain(normalizeEmail(context.email).split('@')[0]) : '';
        if (emailUser.length >= 4 && lower.includes(emailUser)) return 'La contraseña no puede contener tu correo';
        const nameWords = context.name ? plain(context.name).split(/[\s'-]+/).filter((w) => w.length >= 4) : [];
        if (nameWords.some((w) => lower.includes(w))) return 'La contraseña no puede contener tu nombre';
        return null;
    }
};

/* ---------- Validación de formularios completos ---------- */
const PROFILE_FIELDS = ['name', 'lastName', 'email', 'phoneNumber', 'birthdate', 'url_profile', 'address'];

// Normaliza los valores ya válidos para guardarlos de forma consistente.
function normalize(field, value) {
    if (value === undefined || value === null) return value;
    switch (field) {
        case 'email': return normalizeEmail(value);
        case 'birthdate': return parseDateOnly(value);
        case 'url_profile': return String(value).trim();
        case 'password': return String(value);
        default: return collapseSpaces(value);
    }
}

function run(fields, data, { now, context } = {}) {
    const errors = {};
    const values = {};
    for (const field of fields) {
        const raw = data[field];
        // Defensa contra inyección NoSQL: solo se aceptan textos, nunca objetos ni listas
        if (raw !== undefined && raw !== null && typeof raw !== 'string') {
            errors[field] = 'Formato inválido';
            continue;
        }
        const message = field === 'birthdate'
            ? validators.birthdate(raw, now)
            : field === 'password'
                ? validators.password(raw, context)
                : validators[field](raw);
        if (message) {
            errors[field] = message;
            continue;
        }
        // Solo llegan aquí sin error: los obligatorios ya tienen valor, y un opcional vacío se guarda como ''
        values[field] = isBlank(raw) ? '' : normalize(field, raw);
    }
    return { errors, values, valid: Object.keys(errors).length === 0 };
}

export function validateSignUp(data, now) {
    return run([...PROFILE_FIELDS, 'password'], data, { now, context: { email: data.email, name: data.name } });
}

export function validateProfile(data, now) {
    return run(PROFILE_FIELDS, data, { now });
}

export function validateNewPassword(data, profile = {}) {
    return run(['password'], { password: data.newPassword }, { context: profile });
}
