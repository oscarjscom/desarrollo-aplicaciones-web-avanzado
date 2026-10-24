// Reglas de validación compartidas: las usa el buscador del navegador (cliente)
// y la ruta /api/characters (servidor), así las dos comprueban exactamente lo mismo.

export const TEXT_MAX = 40;
export const STATUS_VALUES = ["alive", "dead", "unknown"] as const;
export const GENDER_VALUES = ["female", "male", "genderless", "unknown"] as const;

// Letras (con tildes), números, espacios y signos habituales en nombres: Mr. Poopybutthole, Mytholog (Jerry)
const TEXT_CHARS_RE = /^[\p{L}\p{N} .,'’&!?()\-]+$/u;

export interface TextCheck {
  ok: boolean;
  value: string; // texto limpio (sin espacios de más)
  message: string; // vacío si es válido
}

// Campo de texto opcional (name y type): vacío es válido, pero si trae algo debe cumplir las reglas
export function validateText(raw: unknown, label: string): TextCheck {
  if (raw === null || raw === undefined) return { ok: true, value: "", message: "" };
  if (typeof raw !== "string") return { ok: false, value: "", message: `${label} debe ser texto` };
  const value = raw.trim().replace(/\s+/g, " ");
  if (value.length > TEXT_MAX) return { ok: false, value, message: `${label}: máximo ${TEXT_MAX} caracteres` };
  if (value.length > 0 && !TEXT_CHARS_RE.test(value)) {
    return { ok: false, value, message: `${label}: usa solo letras, números y signos simples` };
  }
  return { ok: true, value, message: "" };
}

export function validateStatus(raw: unknown): (typeof STATUS_VALUES)[number] | "" | null {
  if (raw === null || raw === undefined || raw === "") return "";
  return typeof raw === "string" && (STATUS_VALUES as readonly string[]).includes(raw)
    ? (raw as (typeof STATUS_VALUES)[number])
    : null;
}

export function validateGender(raw: unknown): (typeof GENDER_VALUES)[number] | "" | null {
  if (raw === null || raw === undefined || raw === "") return "";
  return typeof raw === "string" && (GENDER_VALUES as readonly string[]).includes(raw)
    ? (raw as (typeof GENDER_VALUES)[number])
    : null;
}

export function validatePage(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === "") return 1;
  const n = typeof raw === "string" ? Number(raw) : NaN;
  return Number.isInteger(n) && n >= 1 && n <= 100 ? n : null;
}
