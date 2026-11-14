// Reglas de seguridad del inicio de sesión con credenciales
export const MAX_FAILED_ATTEMPTS = 5; // intentos fallidos antes de bloquear la cuenta
export const LOCK_MINUTES = 15; // minutos que dura el bloqueo
export const BCRYPT_ROUNDS = 12; // costo del cifrado de contraseñas
