# Portal · Gestión de proyectos

Aplicación de proyectos, equipo y tareas hecha con [shadcn/ui](https://ui.shadcn.com) (Radix UI y Tailwind CSS) y los componentes copiados en `src/components/ui`. Los datos viven en memoria.

En línea: <https://portal-proyectos-delta.vercel.app>

| Sección | Archivo |
|---|---|
| Resumen (métricas y calendario de entregas) | `src/components/app/SummaryTab.tsx` |
| Proyectos (crear, detalles, editar, eliminar) | `src/components/app/ProjectsTab.tsx`, `ProjectDialog.tsx` |
| Tareas (CRUD y paginación) | `src/components/app/TasksTab.tsx`, `TaskDialog.tsx` |
| Equipo (CRUD y paginación) | `src/components/app/TeamTab.tsx`, `MemberDialog.tsx` |
| Configuración | `src/components/app/SettingsTab.tsx` |
| Validación compartida (cliente y servidor) | `src/lib/validation.ts`, `src/app/actions.ts` |
| Datos en memoria | `src/lib/store.tsx`, `src/lib/seed.ts` |

## Ejecutar
```bash
npm install
npm run dev        # http://localhost:3000/dashboard
npm run build
npm start
```
