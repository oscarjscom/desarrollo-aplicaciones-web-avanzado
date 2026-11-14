import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { BCRYPT_ROUNDS, LOCK_MINUTES, MAX_FAILED_ATTEMPTS } from "@/lib/security";
import { validateLogin } from "@/lib/validation";

// Hash de relleno: se compara cuando el correo no existe, para que la respuesta
// tarde lo mismo y no se pueda saber qué correos están registrados
const DUMMY_HASH = bcrypt.hashSync("contraseña-de-relleno", BCRYPT_ROUNDS);

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      // Los errores que se lanzan aquí llegan a la página de inicio de sesión:
      // INVALID, INVALID:<intentos que quedan> o LOCKED:<minutos de bloqueo>
      async authorize(credentials) {
        const { valid, data } = validateLogin(credentials ?? {});
        if (!valid) throw new Error("INVALID");

        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
          await bcrypt.compare(data.password, DUMMY_HASH);
          throw new Error("INVALID");
        }

        // Cuenta bloqueada por demasiados intentos fallidos
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
          throw new Error(`LOCKED:${minutes}`);
        }

        const passwordOk = await bcrypt.compare(data.password, user.passwordHash);

        if (!passwordOk) {
          const updated = await prisma.user.update({
            where: { id: user.id },
            data: { failedAttempts: { increment: 1 } },
          });
          if (updated.failedAttempts >= MAX_FAILED_ATTEMPTS) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedAttempts: 0,
                lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60000),
              },
            });
            throw new Error(`LOCKED:${LOCK_MINUTES}`);
          }
          throw new Error(`INVALID:${MAX_FAILED_ATTEMPTS - updated.failedAttempts}`);
        }

        // Inicio de sesión correcto: se reinicia el contador
        await prisma.user.update({
          where: { id: user.id },
          data: { failedAttempts: 0, lockedUntil: null },
        });
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    // Guarda con qué proveedor entró el usuario
    async jwt({ token, account }) {
      if (account) token.provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      session.provider = token.provider;
      return session;
    },
  },
};
