"use client";

import { useState } from "react";
import type { MovieSummary } from "@/lib/types";

interface MovieCardProps {
  movie: MovieSummary & { imdbRating?: string };
  index: number; // posición, se dibuja como número grande de fondo
  onOpen: (id: string) => void;
}

const TYPE_LABEL: Record<string, string> = {
  movie: "Película",
  series: "Serie",
  episode: "Episodio",
};

// Tarjeta compacta: el póster es lo principal y el número y la nota ocupan una sola fila.
// Los bordes van en la propia tarjeta (derecha e inferior) para que la última fila nunca deje huecos rellenos.
export default function MovieCard({ movie, index, onOpen }: MovieCardProps) {
  // Algunos pósters de OMDb devuelven 404: si la imagen falla se muestra el título en su lugar
  const [posterFailed, setPosterFailed] = useState(false);
  const hasPoster = movie.Poster && movie.Poster !== "N/A" && !posterFailed;
  const rating = movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : null;

  return (
    <button
      type="button"
      onClick={() => onOpen(movie.imdbID)}
      aria-label={`Ver el detalle de ${movie.Title} (${movie.Year})`}
      className="group flex h-full flex-col border-b-2 border-r-2 border-k-border bg-k-bg p-3 text-left transition-colors duration-300 hover:bg-k-accent focus-visible:bg-k-accent md:p-4"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        {/* Número decorativo: cambia de color con la inversión de la tarjeta */}
        <span
          aria-hidden="true"
          className="select-none text-4xl font-bold leading-[0.8] tracking-tighter text-k-muted transition-colors duration-300 group-hover:text-black md:text-5xl"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {rating && (
          <span className="bg-k-accent px-2 py-0.5 text-sm font-bold tracking-wide text-black transition-colors duration-300 group-hover:bg-black group-hover:text-k-accent">
            ★ {rating}
          </span>
        )}
      </div>

      <div className="relative aspect-[2/3] w-full overflow-hidden border-2 border-k-border bg-k-muted transition-colors duration-300 group-hover:border-black">
        {hasPoster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.Poster}
            alt={`Póster de ${movie.Title}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setPosterFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center text-xl font-bold uppercase leading-none tracking-tighter text-k-muted-fg group-hover:text-black md:text-2xl">
            {movie.Title}
          </div>
        )}
      </div>

      <h3 className="mt-3 text-lg font-bold uppercase leading-[0.95] tracking-tighter text-k-fg transition-colors duration-300 group-hover:text-black md:text-xl">
        {movie.Title}
      </h3>

      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-k-muted-fg transition-colors duration-300 group-hover:text-black md:text-sm">
        {movie.Year} · {TYPE_LABEL[movie.Type] ?? movie.Type}
      </p>
    </button>
  );
}
