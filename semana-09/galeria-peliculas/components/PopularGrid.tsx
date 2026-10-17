"use client";

import { useCallback, useState } from "react";
import type { MovieDetail } from "@/lib/types";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

// Los datos llegan ya resueltos desde el servidor (página SSR). Este componente solo añade
// la interactividad: abrir y cerrar el detalle. Por eso necesita 'use client' y useState.

export default function PopularGrid({ movies }: { movies: MovieDetail[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const current = movies.find((movie) => movie.imdbID === selected);

  return (
    <>
      <div className="grid grid-cols-2 border-l-2 border-t-2 border-k-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {movies.map((movie, index) => (
          <MovieCard key={movie.imdbID} movie={movie} index={index} onOpen={setSelected} />
        ))}
      </div>

      {selected && <MovieModal key={selected} id={selected} preload={current} onClose={close} />}
    </>
  );
}
