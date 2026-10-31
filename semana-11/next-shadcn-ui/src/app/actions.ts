"use server";

// Validación en el servidor. El navegador ya validó el formulario; aquí se vuelven a comprobar los datos
// con las mismas reglas antes de guardarlos, porque lo que llega desde el navegador nunca es de fiar.

import {
  hasErrors,
  validateMember,
  validateProject,
  validateSettings,
  validateTask,
  type FieldErrors,
} from "@/lib/validation";

export interface ServerCheck {
  ok: boolean;
  errors: FieldErrors;
}

const check = (errors: FieldErrors): ServerCheck => ({ ok: !hasErrors(errors), errors });

export async function validateProjectAction(input: unknown): Promise<ServerCheck> {
  return check(validateProject(input));
}

export async function validateMemberAction(input: unknown): Promise<ServerCheck> {
  return check(validateMember(input));
}

export async function validateTaskAction(input: unknown): Promise<ServerCheck> {
  return check(validateTask(input));
}

export async function validateSettingsAction(input: unknown): Promise<ServerCheck> {
  return check(validateSettings(input));
}
