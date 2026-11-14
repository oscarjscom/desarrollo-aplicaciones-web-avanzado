// Reglas de validación compartidas: se usan en los formularios (cliente)
// y otra vez en el servidor antes de crear la cuenta o iniciar sesión.

export type FieldErrors = Record<string, string>;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export function passwordError(password: string): string | null {
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  // bcrypt solo usa los primeros 72 bytes de la contraseña
  if (password.length > 72) return "La contraseña admite como máximo 72 caracteres";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    return "La contraseña debe tener mayúsculas y minúsculas";
  }
  if (!/\d/.test(password)) return "La contraseña debe tener al menos un número";
  return null;
}

export type RegisterData = { name: string; email: string; password: string };

export function validateRegister(input: Record<string, unknown>) {
  const errors: FieldErrors = {};
  const name = text(input.name);
  const email = text(input.email).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";
  const confirmPassword =
    typeof input.confirmPassword === "string" ? input.confirmPassword : "";

  if (!name) errors.name = "El nombre es obligatorio";
  else if (name.length < 2) errors.name = "El nombre debe tener al menos 2 caracteres";
  else if (name.length > 60) errors.name = "El nombre admite como máximo 60 caracteres";

  if (!email) errors.email = "El correo es obligatorio";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Correo inválido";
  else if (email.length > 120) errors.email = "El correo admite como máximo 120 caracteres";

  const pwdError = passwordError(password);
  if (pwdError) errors.password = pwdError;

  if (!confirmPassword) errors.confirmPassword = "Confirma tu contraseña";
  else if (confirmPassword !== password) errors.confirmPassword = "Las contraseñas no coinciden";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { name, email, password } as RegisterData,
  };
}

export function validateLogin(input: Record<string, unknown>) {
  const errors: FieldErrors = {};
  const email = text(input.email).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";

  if (!email) errors.email = "El correo es obligatorio";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Correo inválido";
  if (!password) errors.password = "La contraseña es obligatoria";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { email, password },
  };
}
