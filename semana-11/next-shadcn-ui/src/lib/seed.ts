import type { Activity, Member, Project, Settings, Task } from "./types";

// Datos iniciales en memoria. Al recargar la página vuelven a este estado.

export const seedProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "Plataforma de comercio electrónico",
    description: "Tienda en línea con catálogo, carrito y pagos.",
    category: "Desarrollo Web",
    priority: "Alta",
    status: "En progreso",
    dueDate: "2026-12-15",
  },
  {
    id: "PRJ-002",
    name: "App móvil de reservas",
    description: "Aplicación para reservar citas desde el celular.",
    category: "Desarrollo Mobile",
    priority: "Media",
    status: "En revisión",
    dueDate: "2026-11-30",
  },
  {
    id: "PRJ-003",
    name: "Panel de analítica",
    description: "Tablero con indicadores y gráficos de ventas.",
    category: "Desarrollo Web",
    priority: "Media",
    status: "Planificado",
    dueDate: "2027-01-20",
  },
  {
    id: "PRJ-004",
    name: "API de servicios",
    description: "Servicios internos para conectar los sistemas.",
    category: "Desarrollo Web",
    priority: "Urgente",
    status: "En progreso",
    dueDate: "2026-11-20",
  },
  {
    id: "PRJ-005",
    name: "Sistema de diseño",
    description: "Colores, tipografías y componentes reutilizables.",
    category: "Diseño",
    priority: "Baja",
    status: "Completado",
    dueDate: "2026-10-10",
  },
  {
    id: "PRJ-006",
    name: "Campaña de lanzamiento",
    description: "Plan de comunicación para el nuevo producto.",
    category: "Marketing",
    priority: "Alta",
    status: "En progreso",
    dueDate: "2026-12-05",
  },
];

export const seedMembers: Member[] = [
  { userId: "USR-001", role: "Desarrollador", name: "María García", email: "maria.garcia@portal.pe", position: "Frontend Developer", birthdate: "1996-03-14", phone: "987654321", projectId: "PRJ-001", isActive: true },
  { userId: "USR-002", role: "Desarrollador", name: "Juan Pérez", email: "juan.perez@portal.pe", position: "Backend Developer", birthdate: "1994-08-22", phone: "976543210", projectId: "PRJ-004", isActive: true },
  { userId: "USR-003", role: "Diseñador", name: "Ana López", email: "ana.lopez@portal.pe", position: "UI/UX Designer", birthdate: "1998-11-05", phone: "965432109", projectId: "PRJ-005", isActive: false },
  { userId: "USR-004", role: "Desarrollador", name: "Carlos Ruiz", email: "carlos.ruiz@portal.pe", position: "DevOps Engineer", birthdate: "1992-01-30", phone: "954321098", projectId: "PRJ-004", isActive: true },
  { userId: "USR-005", role: "Gerente", name: "Laura Martínez", email: "laura.martinez@portal.pe", position: "Project Manager", birthdate: "1990-06-18", phone: "943210987", projectId: "PRJ-001", isActive: true },
  { userId: "USR-006", role: "QA", name: "Diego Torres", email: "diego.torres@portal.pe", position: "QA Engineer", birthdate: "1997-09-09", phone: "932109876", projectId: "PRJ-002", isActive: true },
  { userId: "USR-007", role: "Diseñador", name: "Valeria Rojas", email: "valeria.rojas@portal.pe", position: "Marketing Designer", birthdate: "1999-04-27", phone: "921098765", projectId: "PRJ-006", isActive: true },
  { userId: "USR-008", role: "Administrador", name: "Luis Castillo", email: "luis.castillo@portal.pe", position: "Tech Lead", birthdate: "1988-12-02", phone: "910987654", projectId: "PRJ-003", isActive: true },
];

export const seedTasks: Task[] = [
  { id: "TSK-001", description: "Implementar el inicio de sesión", projectId: "PRJ-001", status: "En progreso", priority: "Alta", userId: "USR-001", dateline: "2026-11-12" },
  { id: "TSK-002", description: "Diseñar la pantalla de perfil", projectId: "PRJ-002", status: "Pendiente", priority: "Media", userId: "USR-003", dateline: "2026-11-18" },
  { id: "TSK-003", description: "Configurar la integración continua", projectId: "PRJ-004", status: "Completado", priority: "Alta", userId: "USR-004", dateline: "2026-11-05" },
  { id: "TSK-004", description: "Optimizar las consultas a la base de datos", projectId: "PRJ-001", status: "En progreso", priority: "Urgente", userId: "USR-002", dateline: "2026-11-09" },
  { id: "TSK-005", description: "Documentar los endpoints de la API", projectId: "PRJ-004", status: "Pendiente", priority: "Baja", userId: "USR-002", dateline: "2026-11-25" },
  { id: "TSK-006", description: "Pruebas de la reserva de citas", projectId: "PRJ-002", status: "En revisión", priority: "Alta", userId: "USR-006", dateline: "2026-11-14" },
  { id: "TSK-007", description: "Crear el tablero de ventas", projectId: "PRJ-003", status: "Pendiente", priority: "Media", userId: "USR-008", dateline: "2026-12-02" },
  { id: "TSK-008", description: "Publicar la guía de estilos", projectId: "PRJ-005", status: "Completado", priority: "Baja", userId: "USR-003", dateline: "2026-10-08" },
  { id: "TSK-009", description: "Preparar los textos del lanzamiento", projectId: "PRJ-006", status: "En progreso", priority: "Alta", userId: "USR-007", dateline: "2026-11-22" },
  { id: "TSK-010", description: "Diseñar los banners de la campaña", projectId: "PRJ-006", status: "Pendiente", priority: "Media", userId: "USR-007", dateline: "2026-11-28" },
  { id: "TSK-011", description: "Integrar la pasarela de pagos", projectId: "PRJ-001", status: "Pendiente", priority: "Urgente", userId: "USR-001", dateline: "2026-11-16" },
  { id: "TSK-012", description: "Revisar la seguridad de los accesos", projectId: "PRJ-004", status: "En revisión", priority: "Alta", userId: "USR-004", dateline: "2026-11-11" },
  { id: "TSK-013", description: "Migrar los datos de clientes", projectId: "PRJ-003", status: "Pendiente", priority: "Media", userId: "USR-008", dateline: "2026-12-10" },
  { id: "TSK-014", description: "Probar la app en Android", projectId: "PRJ-002", status: "Completado", priority: "Media", userId: "USR-006", dateline: "2026-11-02" },
];

export const seedActivity: Activity[] = [
  { id: "ACT-004", text: "Carlos Ruiz completó «Configurar la integración continua»", at: Date.now() - 1000 * 60 * 5 },
  { id: "ACT-003", text: "Juan Pérez actualizó «Optimizar las consultas a la base de datos»", at: Date.now() - 1000 * 60 * 60 },
  { id: "ACT-002", text: "Ana López creó el proyecto «Campaña de lanzamiento»", at: Date.now() - 1000 * 60 * 60 * 2 },
  { id: "ACT-001", text: "Laura Martínez actualizó «Plataforma de comercio electrónico»", at: Date.now() - 1000 * 60 * 60 * 3 },
];

export const seedSettings: Settings = {
  workspace: "Portal de proyectos",
  email: "equipo@portal.pe",
  language: "Español",
  timezone: "America/Lima",
  notifyEmail: true,
  notifyPush: false,
  weeklySummary: true,
  pageSize: 5,
};
