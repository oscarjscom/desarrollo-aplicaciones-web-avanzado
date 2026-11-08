<div align="center">

# Semana 12 — APIs integradas
**Laboratorio 12 · API Routes con App Router, Prisma y Supabase · Tarea: búsqueda, estadísticas y páginas de la biblioteca**

[Volver al inicio](../README.md)

</div>

---

## Contenido
| Proyecto | Tipo | Descripción |
|---|---|---|
| [`next-api-routes`](next-api-routes) | Laboratorio y Tarea | Sistema de biblioteca: API Routes de autores y libros (laboratorio) y, sobre el mismo proyecto, búsqueda con paginación, estadísticas y las páginas que consumen la API (tarea) |

**Aplicación en línea (Vercel): <https://biblioteca-api-routes.vercel.app>**

Stack: **Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Prisma 6 (ORM) · PostgreSQL en Supabase · ESLint**.

---

## Laboratorio · API Routes con App Router y Prisma

### Base de datos
La base de datos es PostgreSQL en **Supabase** (proyecto `Biblioteca`). Prisma se conecta con la cadena del **Session pooler** (compatible con IPv4), que se guarda en la variable `DATABASE_URL` del archivo `.env`. Ese archivo no se sube al repositorio; `.env.example` muestra el formato.

| Modelo | Campos | Reglas |
|---|---|---|
| `Author` | `id`, `name`, `email`, `bio`, `nationality`, `birthYear`, `createdAt`, `updatedAt` | `email` único; un autor tiene muchos libros |
| `Book` | `id`, `title`, `description`, `isbn`, `publishedYear`, `genre`, `pages`, `authorId`, `createdAt`, `updatedAt` | `isbn` único; al eliminar el autor se eliminan sus libros (`onDelete: Cascade`); índices en `authorId`, `genre` y `title` |

El esquema está en `prisma/schema.prisma` y el cliente de Prisma en `src/lib/prisma.ts` (una sola instancia, también en desarrollo).

### Endpoints
| Método y ruta | Archivo | Qué hace |
|---|---|---|
| `GET /api/authors` | `src/app/api/authors/route.ts` | Lista los autores con sus libros y la cantidad de libros |
| `POST /api/authors` | `src/app/api/authors/route.ts` | Crea un autor (`201`); email repetido responde `409` |
| `GET /api/authors/[id]` | `src/app/api/authors/[id]/route.ts` | Autor con sus libros; si no existe, `404` |
| `PUT /api/authors/[id]` | `src/app/api/authors/[id]/route.ts` | Actualiza los campos enviados; `404` si no existe, `409` si el email ya está registrado |
| `DELETE /api/authors/[id]` | `src/app/api/authors/[id]/route.ts` | Elimina el autor y sus libros |
| `GET /api/authors/[id]/books` | `src/app/api/authors/[id]/books/route.ts` | Libros de un autor, del más reciente al más antiguo |
| `GET /api/books` | `src/app/api/books/route.ts` | Lista los libros; filtros opcionales `genre` y `authorId` |
| `POST /api/books` | `src/app/api/books/route.ts` | Crea un libro (`201`); autor inexistente `404`, ISBN repetido `409` |
| `GET /api/books/[id]` | `src/app/api/books/[id]/route.ts` | Libro con su autor |
| `PUT /api/books/[id]` | `src/app/api/books/[id]/route.ts` | Actualiza los campos enviados |
| `DELETE /api/books/[id]` | `src/app/api/books/[id]/route.ts` | Elimina el libro |

**Validación en el servidor.** Cada endpoint que recibe datos valida el cuerpo antes de guardar (`src/lib/validation.ts`): título de al menos 3 caracteres, email con formato válido, páginas mayores a 0, año y número enteros, ISBN con formato válido y longitudes máximas. Si algo falla responde `400` con el mensaje y el detalle por campo.

### Pruebas de los endpoints
Cada captura muestra la petición y la respuesta real del servidor local.

<table><tr><td align="center"><img src="capturas/A03_get_autores.jpg" width="460"><br><sub>GET /api/authors · todos los autores</sub></td><td align="center"><img src="capturas/A01_post_autor.jpg" width="460"><br><sub>POST /api/authors · crear autor (201)</sub></td></tr><tr><td align="center"><img src="capturas/A02_post_autor_invalido.jpg" width="460"><br><sub>POST /api/authors · datos inválidos (400)</sub></td><td align="center"><img src="capturas/A04_get_autor_id.jpg" width="460"><br><sub>GET /api/authors/[id] · autor por ID</sub></td></tr><tr><td align="center"><img src="capturas/A11_get_libros_autor.jpg" width="460"><br><sub>GET /api/authors/[id]/books · libros de un autor</sub></td><td align="center"><img src="capturas/A05_put_autor.jpg" width="460"><br><sub>PUT /api/authors/[id] · actualizar autor</sub></td></tr><tr><td align="center"><img src="capturas/A08_get_libros.jpg" width="460"><br><sub>GET /api/books · todos los libros</sub></td><td align="center"><img src="capturas/A09_get_libros_genero.jpg" width="460"><br><sub>GET /api/books?genre=Novela · filtrado por género</sub></td></tr><tr><td align="center"><img src="capturas/A06_post_libro.jpg" width="460"><br><sub>POST /api/books · crear libro (201)</sub></td><td align="center"><img src="capturas/A07_post_libro_invalido.jpg" width="460"><br><sub>POST /api/books · datos inválidos (400)</sub></td></tr><tr><td align="center"><img src="capturas/A10_get_libro_id.jpg" width="460"><br><sub>GET /api/books/[id] · libro por ID</sub></td><td align="center"><img src="capturas/A15_delete_libro.jpg" width="460"><br><sub>DELETE /api/books/[id] · eliminar libro</sub></td></tr><tr><td align="center"><img src="capturas/A16_get_libro_eliminado.jpg" width="460"><br><sub>GET /api/books/[id] · libro ya eliminado (404)</sub></td><td align="center"><img src="capturas/A17_delete_autor.jpg" width="460"><br><sub>DELETE /api/authors/[id] · eliminar autor (y sus libros)</sub></td></tr></table>

---

## Tarea · Búsqueda, estadísticas y páginas

### Requisitos
| Requisito | Cómo se cumple |
|---|---|
| `GET /api/books/search` con paginación | `src/app/api/books/search/route.ts`: `search` (título, parcial y sin distinguir mayúsculas), `genre` (exacto), `authorName` (parcial), `page` (por defecto 1), `limit` (por defecto 10, máximo 50), `sortBy` (`title`, `publishedYear`, `createdAt`) y `order` (`asc`, `desc`). Responde `data` y `pagination` (`page`, `limit`, `total`, `totalPages`, `hasNext`, `hasPrev`). Un valor inválido responde `400` |
| `GET /api/authors/[id]/stats` | `src/app/api/authors/[id]/stats/route.ts`: total de libros, primer y último libro, promedio de páginas, géneros únicos, libro más extenso y más corto |
| Dashboard `app/page.tsx` | Crear, listar, editar y eliminar autores, botón **Ver libros** y estadísticas generales (`GET /api/stats`) |
| Libros `app/books/page.tsx` | Formulario con selector de autor, búsqueda en tiempo real, filtros por género y autor, orden, paginación, total de resultados, estados de carga, editar y eliminar, diseño responsive |
| Detalle `app/authors/[id]/page.tsx` | Información del autor, estadísticas, sus libros, formulario para editar y botón para agregar un libro |

Además de lo pedido, `/api/books/search` acepta `authorId` (lo usa el desplegable de autores) y `GET /api/stats` entrega los totales y los géneros que alimentan el dashboard y el filtro de géneros.

**Validación en el cliente y en el servidor.** Las mismas reglas (`src/lib/validation.ts`) se aplican en los formularios del navegador y otra vez en las API Routes. Si el navegador detecta un error no se hace la petición; si el servidor rechaza un dato (por ejemplo un email o un ISBN repetido) el mensaje aparece en el campo correspondiente.

### Pruebas de los endpoints
<table><tr><td align="center"><img src="capturas/A12_get_search.jpg" width="460"><br><sub>GET /api/books/search · ejemplo del enunciado</sub></td><td align="center"><img src="capturas/A12b_get_search_autor.jpg" width="460"><br><sub>GET /api/books/search · por título y autor, 3 por página</sub></td></tr><tr><td align="center"><img src="capturas/A13_get_search_paginado.jpg" width="460"><br><sub>GET /api/books/search · página 2, 5 por página, por título</sub></td><td align="center"><img src="capturas/A14_get_stats_autor.jpg" width="460"><br><sub>GET /api/authors/[id]/stats · estadísticas del autor</sub></td></tr></table>

### Capturas de la aplicación
**Autores**
<table><tr><td align="center"><img src="capturas/01_dashboard.jpg" width="460"><br><sub>Dashboard: estadísticas generales y lista de autores</sub></td><td align="center"><img src="capturas/02_autor_validacion.jpg" width="460"><br><sub>Nuevo autor: validación en el cliente</sub></td></tr><tr><td align="center"><img src="capturas/03_autor_formulario.jpg" width="460"><br><sub>Nuevo autor: formulario completo</sub></td><td align="center"><img src="capturas/04_autor_creado.jpg" width="460"><br><sub>Autor creado</sub></td></tr><tr><td align="center"><img src="capturas/05_autor_email_repetido.jpg" width="460"><br><sub>Email repetido: lo rechaza el servidor (409)</sub></td><td align="center"><img src="capturas/06_autor_editar.jpg" width="460"><br><sub>Editar autor</sub></td></tr><tr><td align="center"><img src="capturas/07_autor_eliminar_confirmacion.jpg" width="460"><br><sub>Confirmación para eliminar</sub></td><td align="center"><img src="capturas/08_autor_eliminado.jpg" width="460"><br><sub>Autor eliminado</sub></td></tr></table>

**Libros**
<table><tr><td align="center"><img src="capturas/09_libros.jpg" width="460"><br><sub>Libros: filtros, orden y resultados</sub></td><td align="center"><img src="capturas/10_busqueda_tiempo_real.jpg" width="460"><br><sub>Búsqueda en tiempo real</sub></td></tr><tr><td align="center"><img src="capturas/11_sin_resultados.jpg" width="460"><br><sub>Sin resultados</sub></td><td align="center"><img src="capturas/12_filtro_genero.jpg" width="460"><br><sub>Filtro por género</sub></td></tr><tr><td align="center"><img src="capturas/13_filtro_autor.jpg" width="460"><br><sub>Filtro por autor</sub></td><td align="center"><img src="capturas/14_orden_titulo.jpg" width="460"><br><sub>Orden por título ascendente</sub></td></tr><tr><td align="center"><img src="capturas/15_paginacion.jpg" width="460"><br><sub>Paginación (5 por página, página 2)</sub></td><td align="center"><img src="capturas/16_cargando.jpg" width="460"><br><sub>Estado de carga durante la búsqueda</sub></td></tr><tr><td align="center"><img src="capturas/17_libro_validacion.jpg" width="460"><br><sub>Nuevo libro: validación en el cliente</sub></td><td align="center"><img src="capturas/18_libro_formulario.jpg" width="460"><br><sub>Nuevo libro: formulario completo con selector de autor</sub></td></tr><tr><td align="center"><img src="capturas/19_libro_creado.jpg" width="460"><br><sub>Libro creado</sub></td><td align="center"><img src="capturas/20_libro_isbn_repetido.jpg" width="460"><br><sub>ISBN repetido: lo rechaza el servidor (409)</sub></td></tr><tr><td align="center"><img src="capturas/21_libro_editar.jpg" width="460"><br><sub>Editar libro</sub></td><td align="center"><img src="capturas/22_libro_eliminar_confirmacion.jpg" width="460"><br><sub>Confirmación para eliminar</sub></td></tr></table>

**Detalle del autor**
<table><tr><td align="center"><img src="capturas/23_autor_detalle.jpg" width="460"><br><sub>Detalle del autor: datos, estadísticas y libros</sub></td><td align="center"><img src="capturas/24_autor_agregar_libro.jpg" width="460"><br><sub>Agregar un libro a este autor</sub></td></tr><tr><td align="center"><img src="capturas/25_autor_editar.jpg" width="460"><br><sub>Editar la información del autor</sub></td><td align="center"><img src="capturas/26_autor_no_encontrado.jpg" width="460"><br><sub>Autor que no existe</sub></td></tr></table>

**Vista móvil**
<table><tr>
<td align="center"><img src="capturas/27_movil_autores.jpg" width="220"><br><sub>Autores</sub></td>
<td align="center"><img src="capturas/28_movil_libros.jpg" width="220"><br><sub>Libros</sub></td>
<td align="center"><img src="capturas/29_movil_detalle.jpg" width="220"><br><sub>Detalle del autor</sub></td>
</tr></table>

---

## Cómo ejecutarlo
```bash
cd next-api-routes
npm install
cp .env.example .env    # completar DATABASE_URL con la cadena de Supabase (Session pooler)
npx prisma db push      # crea las tablas
npm run seed            # opcional: carga 3 autores y 10 libros de ejemplo
npm run dev             # http://localhost:3000
npm run build
```

## Notas
- `npm run seed` (`prisma/seed.mjs`) carga autores y libros de ejemplo; se puede ejecutar varias veces sin duplicar datos.
- En Next.js 16 el parámetro `params` de las rutas dinámicas es una promesa, por eso los endpoints con `[id]` lo esperan con `await params`.
- Variable de entorno `DATABASE_URL`: en Vercel se configura en **Settings → Environment Variables**; el script `build` ejecuta `prisma generate` antes de compilar.
