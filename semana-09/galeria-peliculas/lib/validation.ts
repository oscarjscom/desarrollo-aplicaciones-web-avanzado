// Reglas de validación compartidas: las usa el formulario del navegador (cliente)
// y la ruta /api/movies (servidor), así las dos comprueban exactamente lo mismo.

export const QUERY_MIN = 3; // con menos letras OMDb responde "Too many results"
export const QUERY_MAX = 60;
export const IMDB_ID_RE = /^tt\d{6,10}$/;
export const TITLE_TYPES = ["movie", "series"] as const;

// Letras (con tildes), números, espacios y algunos signos habituales en títulos
const QUERY_CHARS_RE = /^[\p{L}\p{N} .,:;'’&!?\-]+$/u;

export interface QueryCheck {
  ok: boolean;
  value: string; // texto limpio (sin espacios de más)
  message: string; // vacío si es válido
}

export function validateQuery(raw: unknown): QueryCheck {
  if (typeof raw !== "string") {
    return { ok: false, value: "", message: "La búsqueda debe ser texto" };
  }
  const value = raw.trim().replace(/\s+/g, " ");
  if (value.length === 0) {
    return { ok: false, value, message: "Escribe un título para buscar" };
  }
  if (value.length < QUERY_MIN) {
    return { ok: false, value, message: `Escribe al menos ${QUERY_MIN} letras` };
  }
  if (value.length > QUERY_MAX) {
    return { ok: false, value, message: `Máximo ${QUERY_MAX} caracteres` };
  }
  if (!QUERY_CHARS_RE.test(value)) {
    return { ok: false, value, message: "Usa solo letras, números y signos simples" };
  }
  return { ok: true, value, message: "" };
}

export function validatePage(raw: unknown): number | null {
  const n = typeof raw === "string" ? Number(raw) : NaN;
  return Number.isInteger(n) && n >= 1 && n <= 100 ? n : null;
}

export function validateType(raw: unknown): (typeof TITLE_TYPES)[number] | null {
  return typeof raw === "string" && (TITLE_TYPES as readonly string[]).includes(raw)
    ? (raw as (typeof TITLE_TYPES)[number])
    : null;
}

export function validateImdbId(raw: unknown): string | null {
  return typeof raw === "string" && IMDB_ID_RE.test(raw) ? raw : null;
}
