"use client";

import { useEffect } from "react";
import { IoWarning } from "react-icons/io5";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void; // vuelve a intentar renderizar la ruta
}

// Error Handler de la ruta /pokemon: captura los errores de sus páginas
// (por ejemplo, si la PokeAPI no responde) y evita que se caiga toda la aplicación.
export default function PokemonError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-10 text-center text-gray-700">
        <IoWarning size={64} className="inline-block text-red-500" />
        <h1 className="text-3xl font-bold mt-4">¡Algo salió mal!</h1>
        <p className="mt-3 text-gray-500">
          No pudimos cargar los datos del Pokédex. Revisa tu conexión e inténtalo de nuevo.
        </p>
        <button
          onClick={reset}
          className="mt-8 bg-black hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition cursor-pointer"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
