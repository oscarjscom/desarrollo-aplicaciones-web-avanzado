import { withAuth } from "next-auth/middleware";

// Protege las rutas: si no hay sesión, redirige a la página de inicio de sesión
export default withAuth({
  pages: { signIn: "/signIn" },
});

export const config = { matcher: ["/dashboard", "/profile"] };
