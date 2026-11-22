<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="130" alt="Node.js">

# Desarrollo de Aplicaciones Web Avanzado

**Laboratorios del curso · Node.js, Express, MongoDB y Next.js**

![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4%20%2F%205-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-vistas-B4CA65)
![Materialize](https://img.shields.io/badge/Materialize-CSS-EE6E73)
![JWT](https://img.shields.io/badge/JWT-auth-000000?logo=jsonwebtokens&logoColor=white)

</div>

| | |
|---|---|
| **Alumno** | Oscar Olano — [@oscarjscom](https://github.com/oscarjscom) |
| **Docente** | Edwin William Arévalo Sermeño |
| **Institución** | Tecsup — Departamento de Tecnología Digital |
| **Curso** | Desarrollo de Aplicaciones Web Avanzado — 5 C24 |

## Laboratorios

| Semana | Tema | Contenido | Estado |
|---|---|---|---|
| [Semana 01](semana-01) | Introducción a Node.js | Gestor de tareas por consola con `readline` | Completado |
| [Semana 02](semana-02) | Servidor web | Módulo `http`, vistas Handlebars y API de estudiantes | Completado |
| Semana 03 | — | — | — |
| [Semana 04](semana-04) | Sitio web con Express | Rutas, controladores y vistas EJS · catálogo GameVault | Completado |
| [Semana 05](semana-05) | APIs RESTful | Tickets y notificaciones en capas · errores, paginación y correos | Completado |
| [Semana 06](semana-06) | Bases de datos NoSQL | MongoDB con Mongoose · CRUD de posts y perfil de autor | Completado |
| [Semana 07](semana-07) | Seguridad con JWT | Registro, inicio de sesión, roles y validación en cliente y servidor | Completado |
| [Semana 08](semana-08) | Despliegue de aplicaciones | MongoDB Atlas, Render y CI/CD con GitHub Actions · API con JWT en la nube | Completado |
| [Semana 09](semana-09) | Introducción a Next.js | CSR contra SSR con PokeAPI y Open-Meteo · galería de películas y series con OMDb | Completado |
| [Semana 10](semana-10) | Enrutamiento y páginas | Pokédex con App Router (SSG e ISR) · Rick and Morty con rutas estáticas y dinámicas | Completado |
| [Semana 11](semana-11) | Componentes y estilización | CSS Modules, Tailwind CSS y shadcn/ui · portal de proyectos | Completado |
| [Semana 12](semana-12) | APIs integradas | API Routes con Prisma y Supabase · biblioteca con búsqueda, estadísticas y páginas | Completado |
| [Semana 13](semana-13) | Autenticación y seguridad | NextAuth.js con Google y GitHub · credenciales con bcrypt, registro y bloqueo por intentos | Completado |
| [Semana 14](semana-14) | Optimización y SEO | Portafolio con meta tags, imágenes optimizadas, sitemap y robots · contacto y dominio [oscarjscom.me](https://oscarjscom.me) | Completado |
| Semana 15 | — | — | Pendiente |
| Semana 16 | — | — | Pendiente |

## Organización

| Elemento | Contenido |
|---|---|
| `semana-XX/` | Proyecto de la semana: el **laboratorio** y, cuando la hay, la **tarea** sobre el mismo proyecto |
| `semana-XX/README.md` | Qué se hizo, capturas, rutas o endpoints, cómo ejecutarlo y conclusiones |
| `semana-XX/capturas/` | Capturas del proyecto funcionando |
| Commits | Desde la semana 6, un commit para el laboratorio y otro para la tarea |

Los archivos `.env` no se suben al repositorio. Cada proyecto que los necesita trae un `.env.example` con las variables que hay que crear.

## Entorno
- **Node.js 22** · **npm** · **VS Code** · Windows
- **MongoDB 8** local, con **mongosh** o **MongoDB Compass** para ver los datos
- **Postman** para probar las APIs

## Cómo ejecutar un proyecto
```bash
cd semana-07/express-mongo-auth
npm install
npm run dev
```
Antes de arrancar, copia `.env.example` como `.env` y completa los valores. Para las semanas 6 y 7, MongoDB tiene que estar encendido (`net start MongoDB` en una terminal de administrador).
