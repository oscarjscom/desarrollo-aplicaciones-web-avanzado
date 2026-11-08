# Biblioteca · API Routes con Next.js, Prisma y Supabase

API Routes con el App Router, Prisma como ORM y PostgreSQL en Supabase para gestionar autores y libros.

| Parte | Archivos |
|---|---|
| Esquema de la base de datos | `prisma/schema.prisma` |
| Cliente de Prisma | `src/lib/prisma.ts` |
| Validación de datos | `src/lib/validation.ts` |
| Endpoints de autores | `src/app/api/authors/**/route.ts` |
| Endpoints de libros | `src/app/api/books/**/route.ts` |

## Ejecutar
```bash
npm install
cp .env.example .env    # completar DATABASE_URL con la cadena de Supabase (Session pooler)
npx prisma db push
npm run dev             # http://localhost:3000
npm run build
npm start
```
