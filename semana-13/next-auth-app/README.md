# next-auth-app · Autenticación con NextAuth.js

Inicio de sesión con **Google**, **GitHub** y **correo y contraseña** (bcrypt), con registro de usuarios, bloqueo por intentos fallidos y rutas protegidas.

En línea: <https://next-auth-app-amber.vercel.app>

| Parte | Archivos |
|---|---|
| Opciones de NextAuth y proveedores | `src/lib/auth.ts` |
| Endpoint de autenticación | `src/app/api/auth/[...nextauth]/route.ts` |
| Registro | `src/app/register/page.tsx`, `src/app/api/register/route.ts` |
| Inicio de sesión | `src/app/signIn/page.tsx`, `src/components/SignInForm.tsx` |
| Páginas protegidas | `src/app/dashboard`, `src/app/profile` y `src/middleware.ts` |
| Reglas de seguridad y validación | `src/lib/security.ts`, `src/lib/validation.ts` |
| Base de datos de usuarios | `prisma/schema.prisma`, `src/lib/prisma.ts` |

## Ejecutar
```bash
npm install
cp .env.example .env.local   # completar NEXTAUTH_SECRET, Google, GitHub y DATABASE_URL
npm run db:push              # crea la tabla de usuarios
npm run dev                  # http://localhost:3000
npm run build
npm start
```
