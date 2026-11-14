# next-auth-app · Autenticación con Google

Inicio de sesión con Google (OAuth 2.0) usando NextAuth.js, con sesión de usuario y rutas protegidas.

| Parte | Archivos |
|---|---|
| Opciones de NextAuth y proveedor de Google | `src/lib/auth.ts` |
| Endpoint de autenticación | `src/app/api/auth/[...nextauth]/route.ts` |
| Páginas | `src/app/signIn`, `src/app/dashboard`, `src/app/profile` |
| Protección de rutas | `src/middleware.ts` |
| Componentes | `src/components/SessionProvider.tsx`, `src/components/LogoutButton.tsx` |

## Ejecutar
```bash
npm install
cp .env.example .env.local   # completar NEXTAUTH_SECRET, GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET
npm run dev                  # http://localhost:3000
npm run build
npm start
```
