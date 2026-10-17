import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"], // fuente variable: ya incluye los pesos 300 a 700
});

export const metadata: Metadata = {
  title: "CINE/KINETIC · Galería de Películas y Series",
  description:
    "Galería de películas y series con la API de OMDb: populares renderizadas en el servidor (SSR) y búsqueda en tiempo real en el navegador (CSR).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="k-noise min-h-full flex flex-col">{children}</body>
    </html>
  );
}
