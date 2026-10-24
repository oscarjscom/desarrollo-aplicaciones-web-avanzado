import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import VortexBackground from "@/components/rm/VortexBackground";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"], // fuente variable: ya incluye los pesos 300 a 700
});

export const metadata: Metadata = {
  title: {
    default: "RICK/MORTY · Personajes",
    template: "%s · RICK/MORTY",
  },
  description:
    "Catálogo de los 826 personajes de Rick and Morty: lista estática, búsqueda en tiempo real y una ficha por personaje.",
};

export default function RickMortyLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${spaceGrotesk.variable} kinetic k-space k-noise flex min-h-screen flex-col`}>
      <VortexBackground />

      {/* ---------- Navegación ---------- */}
      <header className="sticky top-0 z-40 border-b-2 border-k-border bg-k-bg/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[95vw] items-center justify-between py-4" aria-label="Principal">
          <Link href="/" className="text-xl font-bold uppercase tracking-tighter md:text-2xl">
            RICK<span className="text-k-accent">/</span>MORTY
          </Link>
          <ul className="flex items-center gap-4 text-sm font-bold uppercase tracking-tighter md:gap-8 md:text-base">
            <li>
              <Link href="/#buscar" className="transition-colors hover:text-k-accent">
                Buscar
              </Link>
            </li>
            <li>
              <Link href="/#personajes" className="transition-colors hover:text-k-accent">
                Personajes
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="relative z-10 flex-1">{children}</main>
    </div>
  );
}
