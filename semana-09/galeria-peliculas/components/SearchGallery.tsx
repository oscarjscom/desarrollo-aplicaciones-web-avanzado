"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import type { SearchResponse, TitleType } from "@/lib/types";
import { QUERY_MAX, validateQuery } from "@/lib/validation";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

// Búsqueda en CSR: lo que se pide depende de lo que el usuario escribe, así que solo el
// navegador puede saberlo. Se usan useState para el estado y useEffect para pedir los datos.

type Filter = "all" | TitleType;

interface Outcome {
  key: string; // a qué búsqueda pertenece este resultado
  data?: SearchResponse;
  error?: string;
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "movie", label: "Películas" },
  { value: "series", label: "Series" },
];
const SUGGESTIONS = ["Marvel", "Batman", "Star Wars", "Suits", "Harry Potter"];
const PAGE_SIZE = 10;

export default function SearchGallery() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const close = useCallback(() => setSelected(null), []);

  // Validación en el cliente, mientras se escribe (el servidor la repite al recibir la petición)
  const check = validateQuery(query);
  const active = validateQuery(debounced);
  const key = active.ok ? `${active.value}|${filter}|${page}` : "";

  // Espera 400 ms desde la última tecla para no pedir datos en cada letra
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Pide los resultados a la API cada vez que cambia la búsqueda, el filtro o la página
  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();

    const search = async () => {
      try {
        const { data } = await axios.get<SearchResponse>("/api/movies", {
          params: { s: active.value, type: filter === "all" ? undefined : filter, page },
          signal: controller.signal,
        });
        setOutcome({ key, data });
      } catch (err) {
        if (axios.isCancel(err)) return;
        const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
        setOutcome({ key, error: message ?? "No se pudo completar la búsqueda" });
      }
    };
    search();

    return () => controller.abort();
  }, [key, active.value, filter, page]);

  const loading = key !== "" && outcome?.key !== key;
  const current = outcome && outcome.key === key ? outcome : null;
  const totalPages = current?.data ? Math.min(Math.ceil(current.data.total / PAGE_SIZE), 100) : 0;
  const showHint = query.length > 0 && !check.ok;

  return (
    <div>
      {/* Campo de búsqueda enorme, solo con borde inferior */}
      <label htmlFor="busqueda" className="block text-xs font-bold uppercase tracking-widest text-k-muted-fg md:text-sm">
        Título de película o serie
      </label>
      <input
        id="busqueda"
        type="search"
        value={query}
        maxLength={QUERY_MAX}
        autoComplete="off"
        spellCheck={false}
        placeholder="Escribe aquí"
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(1);
        }}
        aria-invalid={showHint}
        aria-describedby="busqueda-ayuda"
        className="mt-2 h-20 w-full border-0 border-b-2 border-k-border bg-transparent px-0 text-3xl font-bold uppercase tracking-tighter text-k-fg placeholder:text-k-muted focus:border-k-accent focus-visible:outline-none md:h-24 md:text-5xl"
      />
      <p
        id="busqueda-ayuda"
        role={showHint ? "alert" : undefined}
        className={`mt-3 text-sm font-bold uppercase tracking-widest ${showHint ? "text-k-accent" : "text-k-muted-fg"}`}
      >
        {showHint ? check.message : `Resultados en tiempo real · mínimo 3 letras · ${query.length}/${QUERY_MAX}`}
      </p>

      {/* Filtros por tipo */}
      <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Filtrar por tipo">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => {
              setFilter(item.value);
              setPage(1);
            }}
            className={`h-12 border-2 px-6 text-sm font-bold uppercase tracking-tighter transition-colors duration-200 ${
              filter === item.value
                ? "border-k-accent bg-k-accent text-black"
                : "border-k-border text-k-fg hover:bg-k-fg hover:text-black"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Resultados */}
      <div className="mt-8" aria-live="polite" aria-busy={loading}>
        {!key && (
          <div className="border-2 border-k-border p-8 md:p-12">
            <p className="text-3xl font-bold uppercase leading-none tracking-tighter text-k-muted-fg md:text-5xl">
              Escribe un título y aparecerá aquí
            </p>
            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-k-muted-fg">Prueba con</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    setPage(1);
                  }}
                  className="h-12 border-2 border-k-border px-5 text-sm font-bold uppercase tracking-tighter text-k-fg transition-colors duration-200 hover:border-k-accent hover:bg-k-accent hover:text-black"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 border-l-2 border-t-2 border-k-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="k-motion animate-pulse border-b-2 border-r-2 border-k-border bg-k-bg p-3 md:p-4">
                <div className="mb-3 h-10 w-14 bg-k-muted" />
                <div className="aspect-[2/3] w-full bg-k-muted" />
                <div className="mt-3 h-6 w-3/4 bg-k-muted" />
              </div>
            ))}
          </div>
        )}

        {current?.error && (
          <div role="alert" className="border-2 border-k-accent p-8 md:p-12">
            <p className="text-3xl font-bold uppercase leading-none tracking-tighter text-k-accent md:text-5xl">
              Algo salió mal
            </p>
            <p className="mt-4 text-lg text-k-muted-fg md:text-xl">{current.error}</p>
          </div>
        )}

        {current?.data && current.data.results.length === 0 && (
          <div className="border-2 border-k-border p-8 md:p-12">
            <p className="text-3xl font-bold uppercase leading-none tracking-tighter text-k-fg md:text-5xl">
              Sin resultados para «{active.value}»
            </p>
            <p className="mt-4 text-lg text-k-muted-fg md:text-xl">Prueba con otro título o quita el filtro.</p>
          </div>
        )}

        {current?.data && current.data.results.length > 0 && (
          <>
            <p className="mb-6 text-sm font-bold uppercase tracking-widest text-k-muted-fg md:text-base">
              {current.data.total.toLocaleString("es-PE")} resultados para «{active.value}» · página {page} de {totalPages}
            </p>
            <div className="grid grid-cols-2 border-l-2 border-t-2 border-k-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {current.data.results.map((movie, index) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  index={(page - 1) * PAGE_SIZE + index}
                  onOpen={setSelected}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-between gap-4" aria-label="Paginación de resultados">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-14 border-2 border-k-border px-8 text-sm font-bold uppercase tracking-tighter text-k-fg transition-colors duration-200 hover:bg-k-fg hover:text-black disabled:pointer-events-none disabled:opacity-50"
                >
                  ← Anterior
                </button>
                <span className="text-sm font-bold uppercase tracking-widest text-k-muted-fg">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-14 bg-k-accent px-8 text-sm font-bold uppercase tracking-tighter text-black transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                >
                  Siguiente →
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {selected && <MovieModal key={selected} id={selected} onClose={close} />}
    </div>
  );
}
