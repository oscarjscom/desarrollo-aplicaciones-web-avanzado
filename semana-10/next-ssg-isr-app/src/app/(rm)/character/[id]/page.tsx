import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CharacterImage from "@/components/rm/CharacterImage";
import { getAllCharacters, getCharacter } from "@/lib/rickmorty";

// Revalidación (ISR): cada ficha se vuelve a generar como máximo cada 10 días (10 x 24 x 3600 = 864000).
export const revalidate = 864000;

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

// SSG: genera por adelantado una página para cada uno de los personajes (por Id)
export async function generateStaticParams() {
  const characters = await getAllCharacters();
  return characters.map((character) => ({ id: String(character.id) }));
}

async function loadCharacter(rawId: string) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) notFound();
  const character = await getCharacter(id);
  if (!character) notFound(); // muestra not-found.tsx
  return character;
}

// Metadata dinámica para cada personaje
export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await loadCharacter(id);
  return {
    title: character.name,
    description: `${character.name}: ${character.species}, ${character.status}. Origen: ${character.origin.name}.`,
  };
}

const STATUS_LABEL: Record<string, string> = { Alive: "Vivo", Dead: "Muerto", unknown: "Desconocido" };
const GENDER_LABEL: Record<string, string> = {
  Female: "Mujer",
  Male: "Hombre",
  Genderless: "Sin género",
  unknown: "Desconocido",
};

const episodeNumber = (url: string) => url.split("/").pop() ?? url;

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await loadCharacter(id);
  const alive = character.status === "Alive";

  const created = new Date(character.created).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Todos los campos del Response, tal cual los devuelve la API
  const rawFields: [string, string][] = [
    ["id", String(character.id)],
    ["name", character.name],
    ["status", character.status],
    ["species", character.species],
    ["type", character.type || "(vacío)"],
    ["gender", character.gender],
    ["origin.name", character.origin.name],
    ["origin.url", character.origin.url || "(sin enlace)"],
    ["location.name", character.location.name],
    ["location.url", character.location.url || "(sin enlace)"],
    ["image", character.image],
    ["episode", `${character.episode.length} episodios`],
    ["url", character.url],
    ["created", character.created],
  ];

  return (
    <div className="mx-auto max-w-[95vw] py-6 md:py-10">
      <Link
        href="/#personajes"
        className="inline-flex h-11 items-center border-2 border-k-border px-5 text-sm font-bold uppercase tracking-tighter transition-colors hover:bg-k-fg hover:text-black"
      >
        ← Volver a los personajes
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,26rem)_1fr] md:gap-12">
        {/* Imagen */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden border-2 border-k-border bg-k-muted">
            <CharacterImage src={character.image} name={character.name} priority />
          </div>
          <span
            aria-hidden="true"
            className="mt-4 block select-none text-[6rem] font-bold leading-[0.8] tracking-tighter text-k-muted md:text-[9rem]"
          >
            {String(character.id).padStart(3, "0")}
          </span>
        </div>

        {/* Datos */}
        <div>
          <p
            className={`inline-block px-3 py-1 text-sm font-bold uppercase tracking-widest ${
              alive ? "bg-k-accent text-black" : "border-2 border-k-border text-k-muted-fg"
            }`}
          >
            {STATUS_LABEL[character.status] ?? character.status} · {character.species}
          </p>
          <h1 className="mt-4 text-[clamp(2.5rem,6vw,5.5rem)] font-bold uppercase leading-[0.85] tracking-tighter">
            {character.name}
          </h1>

          <dl className="mt-8 grid gap-px border-2 border-k-border bg-k-border sm:grid-cols-2">
            {[
              ["Especie", character.species],
              ["Tipo", character.type || "—"],
              ["Género", GENDER_LABEL[character.gender] ?? character.gender],
              ["Estado", STATUS_LABEL[character.status] ?? character.status],
              ["Origen", character.origin.name],
              ["Ubicación actual", character.location.name],
              ["Episodios", String(character.episode.length)],
              ["Creado en la API", created],
            ].map(([label, value]) => (
              <div key={label} className="group bg-k-bg/75 p-4 transition-colors duration-300 hover:bg-k-accent md:p-5">
                <dt className="text-xs font-bold uppercase tracking-widest text-k-muted-fg transition-colors duration-300 group-hover:text-black">
                  {label}
                </dt>
                <dd className="mt-1 text-xl font-bold uppercase leading-tight tracking-tighter transition-colors duration-300 group-hover:text-black md:text-2xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 text-sm font-bold uppercase tracking-widest text-k-muted-fg">
            Aparece en {character.episode.length} episodios
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {character.episode.map((url) => (
              <li
                key={url}
                className="border-2 border-k-border px-2 py-1 text-xs font-bold uppercase tracking-wide text-k-fg"
              >
                EP {episodeNumber(url)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Todos los campos del Response */}
      <section className="mt-12" aria-labelledby="campos">
        <h2 id="campos" className="text-2xl font-bold uppercase leading-none tracking-tighter md:text-4xl">
          Campos del <span className="text-k-accent">Response</span>
        </h2>
        <dl className="mt-5 grid gap-px border-2 border-k-border bg-k-border">
          {rawFields.map(([field, value]) => (
            <div key={field} className="grid gap-1 bg-k-bg/75 p-3 sm:grid-cols-[12rem_1fr] sm:gap-4 md:p-4">
              <dt className="font-mono text-sm font-bold text-k-accent">{field}</dt>
              <dd className="break-all font-mono text-sm text-k-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Personaje anterior y siguiente */}
      <nav className="mt-10 flex items-center justify-between gap-4" aria-label="Más personajes">
        {character.id > 1 ? (
          <Link
            href={`/character/${character.id - 1}`}
            className="inline-flex h-14 items-center border-2 border-k-border px-6 text-sm font-bold uppercase tracking-tighter transition-colors hover:bg-k-fg hover:text-black"
          >
            ← #{character.id - 1}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={`/character/${character.id + 1}`}
          className="inline-flex h-14 items-center bg-k-accent px-6 text-sm font-bold uppercase tracking-tighter text-black transition-transform hover:scale-105 active:scale-95"
        >
          #{character.id + 1} →
        </Link>
      </nav>
    </div>
  );
}
