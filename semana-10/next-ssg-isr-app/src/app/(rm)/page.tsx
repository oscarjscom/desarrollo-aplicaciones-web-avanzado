import CharacterCard from "@/components/rm/CharacterCard";
import { Drips, Portal } from "@/components/rm/PortalBackdrop";
import PosterIntro from "@/components/rm/PosterIntro";
import SearchCharacters from "@/components/rm/SearchCharacters";
import { getFirstPage } from "@/lib/rickmorty";

// Revalidación (ISR): la página se guarda y se vuelve a generar como máximo cada 10 días.
// Tiene que ser un número literal: 10 días x 24 h x 3600 s = 864000.
export const revalidate = 864000;

export default async function Home() {
  // Página principal: se renderiza en el servidor. La petición usa `cache: "force-cache"` (ver lib/rickmorty.ts),
  // así que el HTML se genera una vez, al construir, y se sirve desde caché (SSG).
  const { results } = await getFirstPage();

  return (
    <>
      {/* ---------- Póster de entrada (una vez por sesión) ---------- */}
      <PosterIntro />

      {/* ---------- Título: una franja baja, para que la búsqueda y los personajes queden a la vista ---------- */}
      <section id="inicio" className="relative overflow-hidden pb-11 pt-4 md:pb-12 md:pt-5">
        <Portal className="pointer-events-none absolute -right-24 -top-32 h-[20rem] w-[20rem] opacity-60 md:-right-20 md:-top-40 md:h-[26rem] md:w-[26rem]" />
        <Drips className="pointer-events-none absolute inset-x-0 bottom-0 h-8 w-full md:h-10" />
        <div className="relative mx-auto max-w-[95vw]">
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-bold uppercase leading-[0.85] tracking-tighter">
            Rick <span className="text-k-accent">and</span> Morty
          </h1>
        </div>
      </section>

      {/* ---------- 01 · Búsqueda (CSR): es lo principal, por eso va arriba ---------- */}
      <section id="buscar" className="scroll-mt-16 border-b-2 border-k-border py-5 md:py-6">
        <div className="mx-auto max-w-[95vw]">
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span aria-hidden="true" className="text-3xl font-bold leading-none tracking-tighter text-k-muted md:text-4xl">
              01
            </span>
            <h2 className="text-3xl font-bold uppercase leading-none tracking-tighter md:text-4xl">Busca</h2>
          </div>

          <SearchCharacters />
        </div>
      </section>

      {/* ---------- 02 · Personajes (SSR + caché) ---------- */}
      <section id="personajes" className="scroll-mt-16 border-b-2 border-k-border py-6 md:py-8">
        <div className="mx-auto max-w-[95vw]">
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span aria-hidden="true" className="text-3xl font-bold leading-none tracking-tighter text-k-muted md:text-4xl">
              02
            </span>
            <h2 className="text-3xl font-bold uppercase leading-none tracking-tighter md:text-4xl">Personajes</h2>
          </div>

          <div className="grid grid-cols-2 border-l-2 border-t-2 border-k-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {results.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
