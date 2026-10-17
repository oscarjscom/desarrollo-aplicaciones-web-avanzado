import Marquee from "@/components/Marquee";
import PopularGrid from "@/components/PopularGrid";
import SearchGallery from "@/components/SearchGallery";
import { OmdbError, getPopular } from "@/lib/omdb";
import type { MovieDetail } from "@/lib/types";

// SSR: esta página se renderiza en el SERVIDOR en cada visita. Los títulos populares son los
// mismos para todos, así que el HTML llega completo, indexable por buscadores y sin pantalla de carga.
export const dynamic = "force-dynamic";

const FALLBACK_MARQUEE = ["Películas", "Series", "Estrenos", "Clásicos", "Tu próxima maratón"];

export default async function Home() {
  let popular: MovieDetail[] = [];
  let problem: string | null = null;

  try {
    popular = await getPopular();
  } catch (error) {
    problem = error instanceof OmdbError ? error.message : "No se pudieron cargar las películas populares";
  }

  const marqueeTitles = popular.length > 0 ? popular.map((movie) => movie.Title.toUpperCase()) : FALLBACK_MARQUEE;

  return (
    <div className="flex flex-1 flex-col bg-k-bg text-k-fg">
      {/* ---------- Navegación ---------- */}
      <header className="sticky top-0 z-40 border-b-2 border-k-border bg-k-bg">
        <nav className="mx-auto flex max-w-[95vw] items-center justify-between py-4" aria-label="Principal">
          <a href="#inicio" className="text-xl font-bold uppercase tracking-tighter md:text-2xl">
            CINE<span className="text-k-accent">/</span>KINETIC
          </a>
          <ul className="flex items-center gap-4 text-sm font-bold uppercase tracking-tighter md:gap-8 md:text-base">
            <li>
              <a href="#populares" className="transition-colors hover:text-k-accent">
                Populares
              </a>
            </li>
            <li>
              <a href="#buscar" className="transition-colors hover:text-k-accent">
                Buscar
              </a>
            </li>
            <li className="hidden sm:block">
              <a href="#por-que" className="transition-colors hover:text-k-accent">
                ¿Por qué?
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-1">
        {/* ---------- Hero compacto: una franja, para que las películas queden a la vista ---------- */}
        <section id="inicio" className="border-b-2 border-k-border py-6 md:py-8">
          <div className="mx-auto flex max-w-[95vw] flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
            <h1 className="text-[clamp(2.25rem,6vw,5rem)] font-bold uppercase leading-[0.85] tracking-tighter">
              Cine <span className="text-k-accent">Kinetic</span>
            </h1>
            <p className="max-w-md text-base leading-tight text-k-muted-fg md:text-right md:text-lg">
              Películas y series: populares al instante y búsqueda en tiempo real.
            </p>
          </div>
        </section>

        {/* ---------- 01 · Populares (SSR) ---------- */}
        <section id="populares" className="border-b-2 border-k-border py-6 md:py-8">
          <div className="mx-auto max-w-[95vw]">
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span aria-hidden="true" className="text-3xl font-bold leading-none tracking-tighter text-k-muted md:text-4xl">
                01
              </span>
              <h2 className="text-3xl font-bold uppercase leading-none tracking-tighter md:text-4xl">Populares</h2>
              <p className="bg-k-accent px-3 py-1 text-xs font-bold uppercase tracking-widest text-black md:text-sm">
                SSR · renderizado en el servidor
              </p>
              {popular.length === 0 && <p className="text-base text-k-muted-fg">El servidor no pudo traer los títulos.</p>}
            </div>

            {problem && (
              <div role="alert" className="border-2 border-k-accent p-6 md:p-8">
                <p className="text-3xl font-bold uppercase leading-none tracking-tighter text-k-accent md:text-4xl">
                  No se pudo cargar
                </p>
                <p className="mt-3 text-lg text-k-muted-fg">{problem}</p>
              </div>
            )}

            {popular.length > 0 && <PopularGrid movies={popular} />}
          </div>
        </section>

        {/* ---------- Marquesina rápida (acento) ---------- */}
        <Marquee
          items={marqueeTitles}
          label="Títulos populares"
          speed={30}
          className="border-b-2 border-k-border bg-k-accent py-5 text-3xl font-bold uppercase tracking-tighter text-black md:text-5xl"
        />

        {/* ---------- 02 · Búsqueda (CSR) ---------- */}
        <section id="buscar" className="border-b-2 border-k-border py-8 md:py-12">
          <div className="mx-auto max-w-[95vw]">
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span aria-hidden="true" className="text-3xl font-bold leading-none tracking-tighter text-k-muted md:text-4xl">
                02
              </span>
              <h2 className="text-3xl font-bold uppercase leading-none tracking-tighter md:text-4xl">Busca</h2>
              <p className="bg-k-accent px-3 py-1 text-xs font-bold uppercase tracking-widest text-black md:text-sm">
                CSR · renderizado en el navegador
              </p>
            </div>

            <SearchGallery />
          </div>
        </section>

        {/* ---------- Marquesina lenta ---------- */}
        <Marquee
          items={["Sin recargar la página", "Resultados en tiempo real", "Detalle en ventana modal", "Datos de OMDb"]}
          label="Características de la búsqueda"
          speed={55}
          className="border-b-2 border-k-border py-5 text-3xl font-bold uppercase tracking-tighter text-k-fg md:text-5xl"
        />

        {/* ---------- 03 · Justificación ---------- */}
        <section id="por-que" className="border-b-2 border-k-border py-8 md:py-12">
          <div className="mx-auto max-w-[95vw]">
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span aria-hidden="true" className="text-3xl font-bold leading-none tracking-tighter text-k-muted md:text-4xl">
                03
              </span>
              <h2 className="text-3xl font-bold uppercase leading-none tracking-tighter md:text-4xl">
                ¿Por qué <span className="text-k-accent">cada uno?</span>
              </h2>
            </div>

            <div className="grid gap-px border-2 border-k-border bg-k-border lg:grid-cols-2">
              <article className="group bg-k-bg p-6 transition-colors duration-300 hover:bg-k-accent md:p-8">
                <p className="text-sm font-bold uppercase tracking-widest text-k-muted-fg transition-colors duration-300 group-hover:text-black">
                  Portada
                </p>
                <h3 className="mt-2 text-3xl font-bold uppercase leading-none tracking-tighter transition-colors duration-300 group-hover:text-black md:text-5xl">
                  SSR
                </h3>
                <ul className="mt-5 space-y-3 text-base leading-tight text-k-muted-fg transition-colors duration-300 group-hover:text-black md:text-lg">
                  <li>Los populares son los mismos para todos: no dependen de lo que haga el usuario.</li>
                  <li>El HTML llega completo: aparece al instante, sin pantalla de carga.</li>
                  <li>Los buscadores leen el contenido (SEO), porque ya está en el HTML.</li>
                  <li>La clave de OMDb se queda en el servidor y nunca llega al navegador.</li>
                </ul>
              </article>

              <article className="group bg-k-bg p-6 transition-colors duration-300 hover:bg-k-accent md:p-8">
                <p className="text-sm font-bold uppercase tracking-widest text-k-muted-fg transition-colors duration-300 group-hover:text-black">
                  Búsqueda y detalle
                </p>
                <h3 className="mt-2 text-3xl font-bold uppercase leading-none tracking-tighter transition-colors duration-300 group-hover:text-black md:text-5xl">
                  CSR
                </h3>
                <ul className="mt-5 space-y-3 text-base leading-tight text-k-muted-fg transition-colors duration-300 group-hover:text-black md:text-lg">
                  <li>Lo que se pide depende de lo que el usuario escribe: solo el navegador lo sabe.</li>
                  <li>Los resultados cambian sin recargar la página, con useState y useEffect.</li>
                  <li>La ventana modal reacciona a clics y teclado, eventos que solo existen en el cliente.</li>
                  <li>Cada resultado es distinto: no tiene sentido prerenderizarlo ni indexarlo.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Pie ---------- */}
      <footer className="bg-k-accent py-8 text-black md:py-10">
        <div className="mx-auto max-w-[95vw]">
          <p className="text-[clamp(2rem,6vw,4.5rem)] font-bold uppercase leading-[0.85] tracking-tighter">
            Fin del recorrido
          </p>
          <p className="mt-3 max-w-2xl text-base font-bold leading-tight md:text-lg">
            Datos de la API de OMDb (omdbapi.com).
          </p>
        </div>
      </footer>
    </div>
  );
}
