// Reglas de validación compartidas: las usan los formularios del navegador (cliente) y las acciones del
// servidor (src/app/actions.ts), así los dos comprueban exactamente lo mismo.

import {
  CATEGORIES,
  LANGUAGES,
  PAGE_SIZES,
  PRIORITIES,
  PROJECT_STATUSES,
  ROLES,
  TASK_STATUSES,
  TIMEZONES,
} from "./types";

type Obj = Record<string, unknown>;
export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^9\d{8}$/;
const NAME_RE = /^[\p{L}][\p{L} .'’-]*$/u;
const PROJECT_ID_RE = /^PRJ-\d{3,}$/;
const USER_ID_RE = /^USR-\d{3,}$/;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null;
const str = (v: unknown) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");

function validDate(v: unknown): Date | null {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const [y, m, d] = v.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  // Rechaza fechas que no existen, como 2026-02-31
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

function oneOf(list: readonly (string | number)[], v: unknown) {
  return list.includes(v as string | number);
}

export function validateProject(input: unknown): FieldErrors {
  const e: FieldErrors = {};
  if (!isObj(input)) return { form: "Datos inválidos" };

  const name = str(input.name);
  if (!name) e.name = "El nombre es obligatorio";
  else if (name.length < 3) e.name = "Escribe al menos 3 caracteres";
  else if (name.length > 60) e.name = "Máximo 60 caracteres";

  const description = str(input.description);
  if (description.length > 200) e.description = "Máximo 200 caracteres";

  if (!oneOf(CATEGORIES, input.category)) e.category = "Elige una categoría";
  if (!oneOf(PRIORITIES, input.priority)) e.priority = "Elige una prioridad";
  if (!oneOf(PROJECT_STATUSES, input.status)) e.status = "Elige un estado";

  if (!input.dueDate) e.dueDate = "Elige la fecha de entrega";
  else if (!validDate(input.dueDate)) e.dueDate = "La fecha no es válida";

  const ids = input.memberIds;
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string" && USER_ID_RE.test(id))) {
    e.memberIds = "La lista de miembros no es válida";
  }
  return e;
}

export function validateMember(input: unknown): FieldErrors {
  const e: FieldErrors = {};
  if (!isObj(input)) return { form: "Datos inválidos" };

  const name = str(input.name);
  if (!name) e.name = "El nombre es obligatorio";
  else if (name.length < 3) e.name = "Escribe al menos 3 caracteres";
  else if (name.length > 60) e.name = "Máximo 60 caracteres";
  else if (!NAME_RE.test(name)) e.name = "Usa solo letras y espacios";

  const email = str(input.email);
  if (!email) e.email = "El correo es obligatorio";
  else if (!EMAIL_RE.test(email)) e.email = "Escribe un correo válido (nombre@dominio.com)";

  const position = str(input.position);
  if (!position) e.position = "El cargo es obligatorio";
  else if (position.length < 2 || position.length > 50) e.position = "Entre 2 y 50 caracteres";

  if (!oneOf(ROLES, input.role)) e.role = "Elige un rol";

  const birth = validDate(input.birthdate);
  if (!input.birthdate) e.birthdate = "Elige la fecha de nacimiento";
  else if (!birth) e.birthdate = "La fecha no es válida";
  else {
    const now = new Date();
    const age = now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
    if (birth > now) e.birthdate = "La fecha no puede ser futura";
    else if (age < 16) e.birthdate = "Debe tener al menos 16 años";
    else if (age > 90) e.birthdate = "Revisa la fecha de nacimiento";
  }

  const phone = typeof input.phone === "string" ? input.phone.replace(/\s/g, "") : "";
  if (!phone) e.phone = "El teléfono es obligatorio";
  else if (!PHONE_RE.test(phone)) e.phone = "Debe tener 9 dígitos y empezar con 9";

  if (input.projectId !== "" && !(typeof input.projectId === "string" && PROJECT_ID_RE.test(input.projectId))) {
    e.projectId = "El proyecto no es válido";
  }
  if (typeof input.isActive !== "boolean") e.isActive = "Valor no válido";
  return e;
}

export function validateTask(input: unknown): FieldErrors {
  const e: FieldErrors = {};
  if (!isObj(input)) return { form: "Datos inválidos" };

  const description = str(input.description);
  if (!description) e.description = "La descripción es obligatoria";
  else if (description.length < 5) e.description = "Escribe al menos 5 caracteres";
  else if (description.length > 120) e.description = "Máximo 120 caracteres";

  if (!(typeof input.projectId === "string" && PROJECT_ID_RE.test(input.projectId))) e.projectId = "Elige un proyecto";
  if (!oneOf(TASK_STATUSES, input.status)) e.status = "Elige un estado";
  if (!oneOf(PRIORITIES, input.priority)) e.priority = "Elige una prioridad";
  if (!(typeof input.userId === "string" && USER_ID_RE.test(input.userId))) e.userId = "Elige a quién se asigna";

  if (!input.dateline) e.dateline = "Elige la fecha límite";
  else if (!validDate(input.dateline)) e.dateline = "La fecha no es válida";
  return e;
}

export function validateSettings(input: unknown): FieldErrors {
  const e: FieldErrors = {};
  if (!isObj(input)) return { form: "Datos inválidos" };

  const workspace = str(input.workspace);
  if (!workspace) e.workspace = "El nombre del espacio es obligatorio";
  else if (workspace.length < 3 || workspace.length > 40) e.workspace = "Entre 3 y 40 caracteres";

  const email = str(input.email);
  if (!email) e.email = "El correo es obligatorio";
  else if (!EMAIL_RE.test(email)) e.email = "Escribe un correo válido (nombre@dominio.com)";

  if (!oneOf(LANGUAGES, input.language)) e.language = "Elige un idioma";
  if (!oneOf(TIMEZONES, input.timezone)) e.timezone = "Elige una zona horaria";
  if (!oneOf(PAGE_SIZES, input.pageSize)) e.pageSize = "Elige una cantidad válida";
  for (const k of ["notifyEmail", "notifyPush", "weeklySummary"] as const) {
    if (typeof input[k] !== "boolean") e[k] = "Valor no válido";
  }
  return e;
}

export const hasErrors = (e: FieldErrors) => Object.keys(e).length > 0;
