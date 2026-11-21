// Reglas de validación del formulario de contacto: se usan en el navegador
// y otra vez en el servidor antes de aceptar el mensaje.

export type FieldErrors = Record<string, string>;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export type ContactData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function validateContact(input: Record<string, unknown>) {
  const errors: FieldErrors = {};
  const name = text(input.name);
  const email = text(input.email).toLowerCase();
  const subject = text(input.subject);
  const message = text(input.message);

  if (!name) errors.name = 'El nombre es obligatorio';
  else if (name.length < 2) errors.name = 'El nombre debe tener al menos 2 caracteres';
  else if (name.length > 60) errors.name = 'El nombre admite como máximo 60 caracteres';

  if (!email) errors.email = 'El correo es obligatorio';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Correo inválido';
  else if (email.length > 120) errors.email = 'El correo admite como máximo 120 caracteres';

  if (!subject) errors.subject = 'El asunto es obligatorio';
  else if (subject.length < 3) errors.subject = 'El asunto debe tener al menos 3 caracteres';
  else if (subject.length > 100) errors.subject = 'El asunto admite como máximo 100 caracteres';

  if (!message) errors.message = 'El mensaje es obligatorio';
  else if (message.length < 10) errors.message = 'El mensaje debe tener al menos 10 caracteres';
  else if (message.length > 1000) errors.message = 'El mensaje admite como máximo 1000 caracteres';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { name, email, subject, message } as ContactData,
  };
}
