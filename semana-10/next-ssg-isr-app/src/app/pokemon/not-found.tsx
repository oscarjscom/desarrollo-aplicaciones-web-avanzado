import Link from "next/link";
import { IoSearch } from "react-icons/io5";

// NotFound Handler de la ruta /pokemon: se muestra cuando se llama a notFound()
// o cuando la URL no corresponde a ningún Pokémon.
export default function PokemonNotFound() {
  return (
    <div className="p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-10 text-center text-gray-700">
        <IoSearch size={64} className="inline-block text-purple-600" />
        <h1 className="text-3xl font-bold mt-4">Pokémon no encontrado</h1>
        <p className="mt-3 text-gray-500">
          Ese Pokémon no existe en la Pokédex. Prueba con otro nombre o vuelve a la lista.
        </p>
        <Link
          href="/pokemon"
          className="inline-block mt-8 bg-black hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          ← Volver al Pokédex
        </Link>
      </div>
    </div>
  );
}
