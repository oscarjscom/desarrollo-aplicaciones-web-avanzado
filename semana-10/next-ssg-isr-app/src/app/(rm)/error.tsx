"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void; // vuelve a intentar renderizar la ruta
}

// Error Handler del catálogo: se muestra si la API no responde, en vez de romper toda la aplicación.
export default function RickMortyError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[95vw] py-16">
      <div role="alert" className="border-2 border-k-accent p-6 md:p-10">
        <p className="text-3xl font-bold uppercase leading-none tracking-tighter text-k-accent md:text-5xl">
          Algo salió mal
        </p>
        <p className="mt-4 max-w-xl text-lg text-k-muted-fg">
          No pudimos cargar los personajes. Revisa tu conexión e inténtalo de nuevo.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 h-14 bg-k-accent px-8 text-sm font-bold uppercase tracking-tighter text-black transition-transform hover:scale-105 active:scale-95"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
