"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import type { MovieDetail } from "@/lib/types";

// Se usa 'use client' porque el modal depende del estado (useState), de efectos (useEffect)
// y de eventos del navegador (teclado, clics); nada de eso existe en el servidor.

interface MovieModalProps {
  id: string;
  preload?: MovieDetail; // la portada ya trae todo el detalle; la búsqueda lo pide al abrir
  onClose: () => void;
}

const known = (value?: string) => Boolean(value) && value !== "N/A";

const RATING_NAMES: Record<string, string> = {
  "Internet Movie Database": "IMDb",
  "Rotten Tomatoes": "Rotten Tomatoes",
  Metacritic: "Metacritic",
};

export default function MovieModal({ id, preload, onClose }: MovieModalProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(preload ?? null);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Detalle completo desde la API cuando no viene precargado (async/await dentro de useEffect)
  useEffect(() => {
    if (preload) return;
    const controller = new AbortController();

    const load = async () => {
      try {
        const { data } = await axios.get<MovieDetail>("/api/movies", {
          params: { i: id },
          signal: controller.signal,
        });
        setMovie(data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
        setError(message ?? "No se pudo cargar el detalle");
      }
    };
    load();

    return () => controller.abort();
  }, [id, preload]);

  // Escape cierra, el fondo no se desplaza y el foco queda dentro de la ventana
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  const facts: { label: string; value?: string }[] = movie
    ? [
        { label: "Director", value: movie.Director },
        { label: "Guion", value: movie.Writer },
        { label: "Reparto", value: movie.Actors },
        { label: "Estreno", value: movie.Released },
        { label: "Idioma", value: movie.Language },
        { label: "País", value: movie.Country },
        { label: "Premios", value: movie.Awards },
        { label: "Taquilla", value: movie.BoxOffice },
        { label: "Votos en IMDb", value: movie.imdbVotes },
        { label: "Temporadas", value: movie.totalSeasons },
      ].filter((fact) => known(fact.value))
    : [];

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/85 md:p-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-busy={!movie && !error}
        onClick={(event) => event.stopPropagation()}
        className="relative mx-auto min-h-full w-full max-w-6xl border-2 border-k-accent bg-k-bg md:min-h-0"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-0 top-0 z-10 h-14 bg-k-accent px-6 text-sm font-bold uppercase tracking-tighter text-black transition-transform hover:scale-105 active:scale-95"
        >
          Cerrar ✕
        </button>

        {error && (
          <div className="p-8 pt-24 md:p-12 md:pt-28">
            <h2 id="modal-title" className="text-4xl font-bold uppercase tracking-tighter text-k-accent md:text-6xl">
              Algo salió mal
            </h2>
            <p role="alert" className="mt-4 max-w-2xl text-lg text-k-muted-fg md:text-xl">
              {error}
            </p>
          </div>
        )}

        {!movie && !error && (
          <div className="k-motion animate-pulse p-8 pt-24 md:p-12 md:pt-28">
            <h2 id="modal-title" className="sr-only">
              Cargando detalle
            </h2>
            <div className="h-24 w-3/4 bg-k-muted" />
            <div className="mt-6 h-6 w-1/2 bg-k-muted" />
            <div className="mt-10 h-40 w-full bg-k-muted" />
          </div>
        )}

        {movie && (
          <div className="grid md:grid-cols-[minmax(0,340px)_1fr]">
            <div className="border-b-2 border-k-border md:border-b-0 md:border-r-2">
              {known(movie.Poster) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={movie.Poster}
                  alt={`Póster de ${movie.Title}`}
                  referrerPolicy="no-referrer"
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center bg-k-muted p-6 text-center text-4xl font-bold uppercase tracking-tighter text-k-muted-fg">
                  {movie.Title}
                </div>
              )}
            </div>

            <div className="p-8 md:p-12">
              <p className="pr-32 text-sm font-bold uppercase tracking-widest text-k-muted-fg md:text-base">
                {[movie.Year, known(movie.Rated) ? movie.Rated : null, known(movie.Runtime) ? movie.Runtime : null, movie.Type]
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>

              <h2
                id="modal-title"
                className="mt-4 text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.85] tracking-tighter text-k-fg"
              >
                {movie.Title}
              </h2>

              {known(movie.Genre) && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {movie.Genre.split(",").map((genre) => (
                    <li
                      key={genre}
                      className="border-2 border-k-border px-3 py-1 text-sm font-bold uppercase tracking-wide text-k-fg"
                    >
                      {genre.trim()}
                    </li>
                  ))}
                </ul>
              )}

              {movie.Ratings?.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-px border-2 border-k-border bg-k-border sm:grid-cols-3">
                  {movie.Ratings.map((rating) => (
                    <div key={rating.Source} className="bg-k-bg p-4">
                      <p className="text-4xl font-bold leading-none tracking-tighter text-k-accent md:text-5xl">
                        {rating.Value}
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-k-muted-fg">
                        {RATING_NAMES[rating.Source] ?? rating.Source}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {known(movie.Plot) && (
                <p className="mt-8 max-w-2xl text-lg leading-tight text-k-muted-fg md:text-xl">{movie.Plot}</p>
              )}

              {facts.length > 0 && (
                <dl className="mt-8 grid gap-px border-2 border-k-border bg-k-border sm:grid-cols-2">
                  {facts.map((fact) => (
                    <div key={fact.label} className="bg-k-bg p-4">
                      <dt className="text-xs font-bold uppercase tracking-widest text-k-muted-fg">{fact.label}</dt>
                      <dd className="mt-1 text-base text-k-fg">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
