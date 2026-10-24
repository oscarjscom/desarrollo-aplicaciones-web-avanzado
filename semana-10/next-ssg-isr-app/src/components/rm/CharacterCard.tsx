import Link from "next/link";
import type { Character } from "@/types/rickmorty";
import CharacterImage from "./CharacterImage";

const STATUS_LABEL: Record<string, string> = {
  Alive: "Vivo",
  Dead: "Muerto",
  unknown: "Desconocido",
};

const GENDER_LABEL: Record<string, string> = {
  Female: "Mujer",
  Male: "Hombre",
  Genderless: "Sin género",
  unknown: "Género desconocido",
};

// Tarjeta compacta: el número es el id del personaje y la imagen se carga bajo demanda (lazy loading).
// Los bordes van en la propia tarjeta (derecha e inferior) para que la última fila nunca deje huecos.
export default function CharacterCard({ character }: { character: Character }) {
  const alive = character.status === "Alive";

  return (
    <Link
      href={`/character/${character.id}`}
      aria-label={`Ver el detalle de ${character.name}`}
      className="group flex h-full flex-col border-b-2 border-r-2 border-k-border bg-k-bg/75 p-3 transition-colors duration-300 hover:bg-k-accent focus-visible:bg-k-accent md:p-4"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          aria-hidden="true"
          className="select-none text-4xl font-bold leading-[0.8] tracking-tighter text-k-muted transition-colors duration-300 group-hover:text-black md:text-5xl"
        >
          {String(character.id).padStart(3, "0")}
        </span>
        <span
          className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wide transition-colors duration-300 ${
            alive
              ? "bg-k-accent text-black group-hover:bg-black group-hover:text-k-accent"
              : "border-2 border-k-border text-k-muted-fg group-hover:border-black group-hover:text-black"
          }`}
        >
          {STATUS_LABEL[character.status] ?? character.status}
        </span>
      </div>

      <div className="relative aspect-square w-full overflow-hidden border-2 border-k-border bg-k-muted transition-colors duration-300 group-hover:border-black">
        {/* Carga bajo demanda: el navegador solo descarga la imagen cuando se acerca a la pantalla */}
        <CharacterImage src={character.image} name={character.name} />
      </div>

      <h3 className="mt-3 text-lg font-bold uppercase leading-[0.95] tracking-tighter text-k-fg transition-colors duration-300 group-hover:text-black md:text-xl">
        {character.name}
      </h3>

      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-k-muted-fg transition-colors duration-300 group-hover:text-black">
        {character.species} · {GENDER_LABEL[character.gender] ?? character.gender}
      </p>
    </Link>
  );
}
