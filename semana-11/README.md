<div align="center">

# Semana 11 — Componentes y Estilización
**Laboratorio 11 · Componentes con CSS Modules, Tailwind CSS y shadcn/ui · Tarea: Portal de proyectos**

[Volver al inicio](../README.md)

</div>

---

## Contenido
| Proyecto | Tipo | Descripción |
|---|---|---|
| [`next-components-styling`](next-components-styling) | Laboratorio · Ejercicio 1 | Botones, tarjetas, badges e inputs que combinan CSS Modules y Tailwind CSS (`/styling`) |
| [`next-shadcn-ui`](next-shadcn-ui) | Laboratorio · Ejercicio 2 y Tarea | Dashboard con shadcn/ui (`/dashboard`) que en la tarea se convierte en **Portal**, la aplicación de gestión de proyectos |

Stack: **Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · CSS Modules · shadcn/ui (Radix UI) · ESLint**.

---

## Laboratorio

### Ejercicio 1 · Componentes reutilizables con CSS Modules y Tailwind CSS

| Paso | Captura |
|---|---|
| Node y npm | <img src="capturas/01_terminal_node.png" width="320"> |
| Crear el proyecto `next-components-styling` | <img src="capturas/02_terminal_create_next_app.png" width="320"> |
| Tailwind con PostCSS (para que funcionen los CSS Modules) | <img src="capturas/04_terminal_tailwind_postcss.png" width="320"> |
| Estructura de la carpeta `src` | <img src="capturas/03_estructura_proyecto.png" width="320"> |
| `npm run dev` | <img src="capturas/05_terminal_npm_run_dev.png" width="320"> |

| Componente | Archivos | Técnica |
|---|---|---|
| Button | `Button.tsx` y `Button.module.css` | CSS Modules para la onda, los degradados y la animación de carga; Tailwind para tamaños |
| Card | `Card.tsx` | Solo Tailwind |
| Badge | `Badge.tsx` | Solo Tailwind |
| Input | `Input.tsx` y `Input.module.css` | CSS Modules para el label flotante y la animación de error; Tailwind para la estructura |
| Página contenedora | `src/app/styling/page.tsx` | Une todos los componentes |

**Resultado de la ruta `/styling`**
<table><tr>
<td align="center"><img src="capturas/06_styling_inicio.jpg" width="440"><br><sub>Inicio de la página</sub></td>
<td align="center"><img src="capturas/07_styling_pagina_completa.jpg" width="300"><br><sub>Página completa</sub></td>
</tr></table>

**Efectos: onda, carga y validación del email**
<table><tr>
<td align="center"><img src="capturas/08_boton_efecto_onda.jpg" width="300"><br><sub>Efecto de onda al hacer clic</sub></td>
<td align="center"><img src="capturas/09_boton_cargando.jpg" width="300"><br><sub>Botón en estado "Cargando…"</sub></td>
</tr><tr>
<td align="center"><img src="capturas/10_formulario_email_invalido.jpg" width="300"><br><sub>Email inválido: mensaje de error</sub></td>
<td align="center"><img src="capturas/11_formulario_email_valido.jpg" width="300"><br><sub>Email válido</sub></td>
</tr></table>

**Descripción del resultado: CSS Modules y Tailwind CSS combinados**
- **CSS Modules** se usó para lo complejo: el efecto de onda al hacer clic, los degradados con sombra, la animación de carga, el label flotante del input y la animación de error. Cada clase queda con un nombre único (por ejemplo `Button-module__…__primary`), así que no choca con las de otros componentes.
- **Tailwind CSS** se usó para lo simple: colores, tamaños, espaciado, bordes y diseño responsive, escritos directo en el HTML con clases.
- **Juntos** funcionan bien: el botón usa un módulo para el efecto y Tailwind para su tamaño, y el input usa un módulo para animar y Tailwind para la estructura. Así cada herramienta hace lo que mejor sabe.

**Nota sobre la configuración.** La versión actual de `create-next-app` deja una regla en `next.config.ts` que manda todos los `.css` por el cargador de Tailwind, y con eso los CSS Modules se rompían (`styles.button` salía `undefined` y los botones no se veían). Se cambió a la configuración estándar de Tailwind 4: se instaló `@tailwindcss/postcss`, se creó `postcss.config.mjs` y se quitó esa regla.

### Ejercicio 2 · Componentes con librerías externas: Dashboard de proyectos con shadcn/ui

| Paso | Captura |
|---|---|
| Crear el proyecto `next-shadcn-ui` | <img src="capturas/19_terminal_crear_next_shadcn_ui.png" width="320"> |
| `npx shadcn@latest init` | <img src="capturas/20_terminal_shadcn_init.png" width="320"> |
| Agregar los componentes | <img src="capturas/21_terminal_shadcn_add_componentes.png" width="320"> |
| Carpeta `components/ui` | <img src="capturas/22_carpeta_components_ui.png" width="320"> |

Los componentes se copian dentro del proyecto (`src/components/ui`), así que el código es propio y se puede modificar. Se instalaron `button`, `card`, `input`, `label`, `dialog`, `tabs`, `select`, `badge`, `avatar`, `switch`, `table` y `checkbox`. El comando `form` no genera ningún archivo en la versión actual de shadcn, y el código del laboratorio no lo necesita.

| Archivo | Qué hace |
|---|---|
| `src/app/dashboard/page.tsx` | Dashboard con pestañas: Resumen, Proyectos, Tareas, Equipo y Configuración |
| `src/components/ProjectForm.tsx` | Formulario "Nuevo Proyecto" dentro de un diálogo, con `Select` de categoría y prioridad |
| `src/components/TasksTable.tsx` | Tabla de tareas con `Checkbox`, `Badge` de estado y prioridad, y botón Editar |

**Resultado de la ruta `/dashboard`**
<table><tr>
<td align="center"><img src="capturas/12_dashboard_resumen.jpg" width="440"><br><sub>Resumen</sub></td>
<td align="center"><img src="capturas/13_dashboard_proyectos.jpg" width="440"><br><sub>Proyectos</sub></td>
</tr><tr>
<td align="center"><img src="capturas/14_dashboard_tareas.jpg" width="440"><br><sub>Tareas (tabla de datos)</sub></td>
<td align="center"><img src="capturas/15_dashboard_equipo.jpg" width="440"><br><sub>Equipo</sub></td>
</tr><tr>
<td align="center"><img src="capturas/16_dashboard_configuracion.jpg" width="440"><br><sub>Configuración</sub></td>
<td align="center"><img src="capturas/17_formulario_nuevo_proyecto.jpg" width="440"><br><sub>Formulario en diálogo</sub></td>
</tr><tr>
<td align="center"><img src="capturas/18_formulario_lista_categoria.jpg" width="440"><br><sub>Lista de categorías (Select)</sub></td>
<td></td>
</tr></table>

**Notas sobre la configuración.** El tema se dejó en **Slate**, como en el documento. Con la versión actual de shadcn, `init` dejó una variable de fuente que se referenciaba a sí misma (`--font-sans: var(--font-sans)`) y el texto salía en serif; se corrigió apuntándola a la fuente Geist del proyecto. Igual que en el ejercicio 1, Tailwind se usa con `@tailwindcss/postcss`.

---

## Tarea · Portal de proyectos
**Aplicación en línea (Vercel): <https://portal-proyectos-delta.vercel.app>**

Aplicación de gestión de proyectos, equipo y tareas, hecha sobre el proyecto `next-shadcn-ui`. Los datos viven en memoria: al recargar la página vuelven al estado inicial.

| Requisito | Cómo se cumple |
|---|---|
| Cambiar el tema (color) | Tema oscuro con el verde del portal como color principal: variables de color en `src/app/globals.css` |
| **Spinner** para simular peticiones | `src/components/ui/spinner.tsx`: carga inicial, guardado y eliminación esperan como si fueran peticiones al backend |
| **Alert** para validar formularios | `ErrorAlert` y `SuccessAlert` en `src/components/app/FormParts.tsx`, en todos los formularios |
| **Calendar** para fechas | `DatePicker` (Calendar dentro de un Popover) para fecha de entrega, nacimiento y fecha límite; y el calendario de entregas del Resumen |
| **Pagination** | Proyectos, Tareas y Equipo |
| Proyectos: miembros, crear, ver detalles, eliminar | `ProjectsTab`, `ProjectDialog`: campo de miembros del equipo, formulario completo, ventana de detalles, eliminar con confirmación (y editar) |
| Equipo: CRUD | `TeamTab`, `MemberDialog`: `userId`, `role`, `name`, `email`, `position`, `birthdate`, `phone`, `projectId`, `isActive` |
| Tareas: CRUD y paginación | `TasksTab`, `TaskDialog`: `description`, `projectId`, `status`, `priority`, `userId`, `dateline` |
| Configuración: formulario | `SettingsTab`: nombre del espacio, correo, idioma, zona horaria, filas por página y notificaciones |
| Resumen: métricas con los datos en memoria | `SummaryTab`: todas las cifras se calculan con los datos actuales y cambian al crear, editar o eliminar |

**Validación en el cliente y en el servidor.** Las mismas reglas (`src/lib/validation.ts`) se aplican en el formulario del navegador y otra vez en el servidor, mediante acciones de servidor (`src/app/actions.ts`), antes de guardar cada dato. Si el navegador detecta un error, ni siquiera se hace la petición.

**Un miembro pertenece a un solo proyecto.** Al elegir miembros en un proyecto, pasan a ese proyecto; si ya estaban en otro, se mueven.

### Capturas
**Carga y resumen**
<table><tr><td align="center"><img src="capturas/23_tarea_cargando_spinner.jpg" width="440"><br><sub>Spinner mientras cargan los datos</sub></td><td align="center"><img src="capturas/24_tarea_resumen.jpg" width="440"><br><sub>Resumen: métricas, avance y calendario de entregas</sub></td></tr></table>

**Proyectos**
<table><tr><td align="center"><img src="capturas/25_tarea_proyectos.jpg" width="440"><br><sub>Proyectos</sub></td><td align="center"><img src="capturas/26_tarea_proyecto_validacion_alert.jpg" width="440"><br><sub>Nuevo proyecto: Alert de validación</sub></td></tr><tr><td align="center"><img src="capturas/27_tarea_proyecto_calendario.jpg" width="440"><br><sub>Nuevo proyecto: Calendar para la fecha de entrega</sub></td><td align="center"><img src="capturas/28_tarea_proyecto_formulario_completo.jpg" width="440"><br><sub>Nuevo proyecto: formulario con miembros del equipo</sub></td></tr><tr><td align="center"><img src="capturas/29_tarea_proyecto_guardando_spinner.jpg" width="440"><br><sub>Spinner al guardar el proyecto</sub></td><td align="center"><img src="capturas/30_tarea_proyecto_creado_paginacion.jpg" width="440"><br><sub>Proyecto creado y paginación</sub></td></tr><tr><td align="center"><img src="capturas/31_tarea_proyecto_detalle.jpg" width="440"><br><sub>Ver detalles del proyecto</sub></td><td align="center"><img src="capturas/32_tarea_proyecto_eliminar_confirmacion.jpg" width="440"><br><sub>Confirmación para eliminar</sub></td></tr><tr><td align="center"><img src="capturas/33_tarea_proyecto_eliminando_spinner.jpg" width="440"><br><sub>Spinner al eliminar</sub></td><td></td></tr></table>

**Tareas**
<table><tr><td align="center"><img src="capturas/34_tarea_tareas_paginacion.jpg" width="440"><br><sub>Tareas con paginación</sub></td><td align="center"><img src="capturas/35_tarea_tareas_filtro.jpg" width="440"><br><sub>Filtro por estado</sub></td></tr><tr><td align="center"><img src="capturas/36_tarea_tarea_validacion_alert.jpg" width="440"><br><sub>Nueva tarea: Alert de validación</sub></td><td align="center"><img src="capturas/37_tarea_tarea_calendario.jpg" width="440"><br><sub>Nueva tarea: Calendar de la fecha límite</sub></td></tr><tr><td align="center"><img src="capturas/38_tarea_tarea_formulario_completo.jpg" width="440"><br><sub>Nueva tarea: formulario completo</sub></td><td align="center"><img src="capturas/39_tarea_tarea_creada.jpg" width="440"><br><sub>Tarea creada</sub></td></tr></table>

**Equipo**
<table><tr><td align="center"><img src="capturas/40_tarea_equipo_paginacion.jpg" width="440"><br><sub>Equipo con paginación</sub></td><td align="center"><img src="capturas/41_tarea_miembro_validacion_alert.jpg" width="440"><br><sub>Nuevo miembro: Alert de validación</sub></td></tr><tr><td align="center"><img src="capturas/42_tarea_miembro_calendario.jpg" width="440"><br><sub>Nuevo miembro: Calendar de nacimiento</sub></td><td align="center"><img src="capturas/43_tarea_miembro_formulario_completo.jpg" width="440"><br><sub>Nuevo miembro: formulario completo</sub></td></tr><tr><td align="center"><img src="capturas/44_tarea_miembro_creado.jpg" width="440"><br><sub>Miembro creado</sub></td><td></td></tr></table>

**Configuración y resumen actualizado**
<table><tr><td align="center"><img src="capturas/45_tarea_configuracion.jpg" width="440"><br><sub>Configuración</sub></td><td align="center"><img src="capturas/46_tarea_configuracion_validacion_alert.jpg" width="440"><br><sub>Configuración: Alert de validación</sub></td></tr><tr><td align="center"><img src="capturas/47_tarea_configuracion_guardando_spinner.jpg" width="440"><br><sub>Spinner al guardar la configuración</sub></td><td align="center"><img src="capturas/48_tarea_configuracion_guardada.jpg" width="440"><br><sub>Configuración guardada</sub></td></tr><tr><td align="center"><img src="capturas/49_tarea_resumen_actualizado.jpg" width="440"><br><sub>Resumen con los datos actualizados</sub></td><td></td></tr></table>

**Vista móvil y despliegue**
<table><tr>
<td align="center"><img src="capturas/50_tarea_movil_resumen.jpg" width="200"> <img src="capturas/51_tarea_movil_proyectos.jpg" width="200"><br><sub>Vista móvil</sub></td>
<td align="center"><img src="capturas/52_tarea_vercel_panel.jpg" width="440"><br><sub>Despliegue en Vercel (estado Ready)</sub></td>
</tr></table>

---

## Cómo ejecutarlo
```bash
# Ejercicio 1
cd semana-11/next-components-styling
npm install
npm run dev            # http://localhost:3000/styling

# Ejercicio 2
cd semana-11/next-shadcn-ui
npm install
npm run dev            # http://localhost:3000/dashboard (la tarea)
```

---
