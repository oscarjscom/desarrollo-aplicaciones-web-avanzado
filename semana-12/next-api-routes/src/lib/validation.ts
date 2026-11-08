// Reglas de validación compartidas: se usan en los formularios (cliente)
// y otra vez en las API Routes (servidor) antes de guardar.

export type FieldErrors = Record<string, string>;
export type Mode = "create" | "update";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ISBN_REGEX = /^[0-9Xx-]{10,17}$/;

export type AuthorData = {
  name?: string;
  email?: string;
  bio?: string | null;
  nationality?: string | null;
  birthYear?: number | null;
};

export type BookData = {
  title?: string;
  description?: string | null;
  isbn?: string | null;
  publishedYear?: number | null;
  genre?: string | null;
  pages?: number | null;
  authorId?: string;
};

export type ValidationResult<T> = {
  valid: boolean;
  errors: FieldErrors;
  data: T;
};

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();

function optionalText(
  input: Record<string, unknown>,
  key: string,
  label: string,
  max: number,
  errors: FieldErrors,
  data: Record<string, unknown>,
) {
  if (input[key] === undefined) return;
  const value = text(input[key]);
  if (!value) data[key] = null;
  else if (value.length > max) errors[key] = `${label} admite como máximo ${max} caracteres`;
  else data[key] = value;
}

function optionalInt(
  input: Record<string, unknown>,
  key: string,
  label: string,
  min: number,
  max: number,
  errors: FieldErrors,
  data: Record<string, unknown>,
) {
  if (input[key] === undefined) return;
  const raw = input[key];
  if (raw === null || text(raw) === "") {
    data[key] = null;
    return;
  }
  const value = typeof raw === "number" ? raw : Number(text(raw));
  if (!Number.isInteger(value)) errors[key] = `${label} debe ser un número entero`;
  else if (value < min || value > max) errors[key] = `${label} debe estar entre ${min} y ${max}`;
  else data[key] = value;
}

export function validateAuthor(
  input: Record<string, unknown>,
  mode: Mode,
): ValidationResult<AuthorData> {
  const errors: FieldErrors = {};
  const data: Record<string, unknown> = {};

  if (mode === "create" || input.name !== undefined) {
    const name = text(input.name);
    if (!name) errors.name = "El nombre es obligatorio";
    else if (name.length < 2) errors.name = "El nombre debe tener al menos 2 caracteres";
    else if (name.length > 100) errors.name = "El nombre admite como máximo 100 caracteres";
    else data.name = name;
  }

  if (mode === "create" || input.email !== undefined) {
    const email = text(input.email).toLowerCase();
    if (!email) errors.email = "El email es obligatorio";
    else if (!EMAIL_REGEX.test(email)) errors.email = "Email inválido";
    else data.email = email;
  }

  optionalText(input, "bio", "La biografía", 500, errors, data);
  optionalText(input, "nationality", "La nacionalidad", 60, errors, data);
  optionalInt(input, "birthYear", "El año de nacimiento", 1000, new Date().getFullYear(), errors, data);

  return { valid: Object.keys(errors).length === 0, errors, data: data as AuthorData };
}

export function validateBook(
  input: Record<string, unknown>,
  mode: Mode,
): ValidationResult<BookData> {
  const errors: FieldErrors = {};
  const data: Record<string, unknown> = {};

  if (mode === "create" || input.title !== undefined) {
    const title = text(input.title);
    if (!title) errors.title = "El título es obligatorio";
    else if (title.length < 3) errors.title = "El título debe tener al menos 3 caracteres";
    else if (title.length > 200) errors.title = "El título admite como máximo 200 caracteres";
    else data.title = title;
  }

  if (mode === "create" || input.authorId !== undefined) {
    const authorId = text(input.authorId);
    if (!authorId) errors.authorId = "Selecciona un autor";
    else data.authorId = authorId;
  }

  if (input.isbn !== undefined) {
    const isbn = text(input.isbn);
    if (!isbn) data.isbn = null;
    else if (!ISBN_REGEX.test(isbn)) errors.isbn = "El ISBN solo admite números y guiones (10 a 17 caracteres)";
    else data.isbn = isbn;
  }

  optionalText(input, "description", "La descripción", 1000, errors, data);
  optionalText(input, "genre", "El género", 50, errors, data);
  optionalInt(input, "publishedYear", "El año de publicación", 0, new Date().getFullYear() + 1, errors, data);
  optionalInt(input, "pages", "El número de páginas", 1, 100000, errors, data);

  return { valid: Object.keys(errors).length === 0, errors, data: data as BookData };
}

export const firstError = (errors: FieldErrors) => Object.values(errors)[0] ?? "Datos inválidos";
