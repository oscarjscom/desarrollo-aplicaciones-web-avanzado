<div align="center">

# Semana 12 — APIs integradas
**Laboratorio 12 · API Routes con App Router, Prisma y Supabase**

[Volver al inicio](../README.md)

</div>

---

## Contenido
| Proyecto | Tipo | Descripción |
|---|---|---|
| [`next-api-routes`](next-api-routes) | Laboratorio | Sistema de biblioteca: API Routes de autores y libros con Prisma y PostgreSQL en Supabase |

Stack: **Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Prisma 6 (ORM) · PostgreSQL en Supabase · ESLint**.

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

## Cómo ejecutarlo
```bash
cd next-api-routes
npm install
cp .env.example .env    # completar DATABASE_URL con la cadena de Supabase (Session pooler)
npx prisma db push      # crea las tablas
npm run dev             # http://localhost:3000
npm run build
```

## Notas
- En Next.js 16 el parámetro `params` de las rutas dinámicas es una promesa, por eso los endpoints con `[id]` lo esperan con `await params`.
- El script `build` ejecuta `prisma generate` antes de compilar.
