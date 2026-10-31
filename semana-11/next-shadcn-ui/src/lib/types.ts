// Modelo de datos de la aplicación. Las listas de opciones se comparten entre los formularios y la validación.

export const CATEGORIES = ["Desarrollo Web", "Desarrollo Mobile", "Diseño", "Marketing", "Otro"] as const;
export const PRIORITIES = ["Baja", "Media", "Alta", "Urgente"] as const;
export const PROJECT_STATUSES = ["Planificado", "En progreso", "En revisión", "Completado"] as const;
export const TASK_STATUSES = ["Pendiente", "En progreso", "En revisión", "Completado"] as const;
export const ROLES = ["Administrador", "Gerente", "Desarrollador", "Diseñador", "QA"] as const;
export const LANGUAGES = ["Español", "English", "Português"] as const;
export const TIMEZONES = ["America/Lima", "America/Bogota", "America/Mexico_City", "America/Santiago", "Europe/Madrid"] as const;
export const PAGE_SIZES = [5, 10] as const;

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type Role = (typeof ROLES)[number];
export type Language = (typeof LANGUAGES)[number];
export type Timezone = (typeof TIMEZONES)[number];

export interface Project {
  id: string; // PRJ-001
  name: string;
  description: string;
  category: Category;
  priority: Priority;
  status: ProjectStatus;
  dueDate: string; // yyyy-MM-dd
}

export interface Member {
  userId: string; // USR-001
  role: Role;
  name: string;
  email: string;
  position: string;
  birthdate: string; // yyyy-MM-dd
  phone: string; // 9 dígitos
  projectId: string; // "" si no tiene proyecto
  isActive: boolean;
}

export interface Task {
  id: string; // TSK-001
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  userId: string;
  dateline: string; // yyyy-MM-dd
}

export interface Activity {
  id: string;
  text: string;
  at: number; // marca de tiempo
}

export interface Settings {
  workspace: string;
  email: string;
  language: Language;
  timezone: Timezone;
  notifyEmail: boolean;
  notifyPush: boolean;
  weeklySummary: boolean;
  pageSize: (typeof PAGE_SIZES)[number];
}

// Datos que llegan desde los formularios (sin id)
export type ProjectInput = Omit<Project, "id"> & { memberIds: string[] };
export type MemberInput = Omit<Member, "userId">;
export type TaskInput = Omit<Task, "id">;

export type Errors<T> = Partial<Record<keyof T, string>>;

export interface ServiceResult {
  ok: boolean;
  errors?: Record<string, string>;
  message?: string;
}
