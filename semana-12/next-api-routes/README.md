# Biblioteca · API Routes con Next.js, Prisma y Supabase

Sistema de autores y libros: API Routes con el App Router, Prisma como ORM y PostgreSQL en Supabase, más las páginas que consumen la API.

En línea: <https://biblioteca-api-routes.vercel.app>

| Parte | Archivos |
|---|---|
| Esquema de la base de datos | `prisma/schema.prisma` |
| Cliente de Prisma | `src/lib/prisma.ts` |
| Validación compartida (cliente y servidor) | `src/lib/validation.ts` |
| Endpoints de autores | `src/app/api/authors/**/route.ts` |
| Endpoints de libros | `src/app/api/books/**/route.ts` |
| Estadísticas generales | `src/app/api/stats/route.ts` |
| Dashboard de autores | `src/app/page.tsx` |
| Búsqueda de libros | `src/app/books/page.tsx`, `src/components/BooksView.tsx` |
| Detalle de un autor | `src/app/authors/[id]/page.tsx` |
| Datos de ejemplo | `prisma/seed.mjs` |

## Ejecutar
```bash
npm install
cp .env.example .env    # completar DATABASE_URL con la cadena de Supabase (Session pooler)
npx prisma db push
npm run seed            # opcional: carga autores y libros de ejemplo
npm run dev             # http://localhost:3000
npm run build
npm start
```
