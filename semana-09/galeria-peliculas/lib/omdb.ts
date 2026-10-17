// Cliente de la API de OMDb. Solo se usa en el SERVIDOR (página principal y /api/movies):
// la clave vive en la variable de entorno OMDB_API_KEY y nunca llega al navegador.

import type { MovieDetail, SearchResponse } from "./types";

const BASE_URL = process.env.OMDB_API_URL ?? "https://www.omdbapi.com/";

export class OmdbError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Películas y series populares que se muestran en la portada
export const POPULAR_IDS = [
  "tt0111161", // The Shawshank Redemption
  "tt0068646", // The Godfather
  "tt0468569", // The Dark Knight
  "tt1375666", // Inception
  "tt0816692", // Interstellar
  "tt0133093", // The Matrix
  "tt0903747", // Breaking Bad
  "tt0944947", // Game of Thrones
  "tt4574334", // Stranger Things
  "tt3896198", // Guardians of the Galaxy Vol. 2
  "tt0848228", // The Avengers
  "tt1160419", // Dune
];

/* ---------- Caché en memoria: cuida el límite diario de la clave gratuita ---------- */
const cache = new Map<string, { at: number; value: unknown }>();
const MAX_ENTRIES = 300;

async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as T;
  const value = await load();
  if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
  cache.set(key, { at: Date.now(), value });
  return value;
}

/* ---------- Petición base ---------- */
async function request(params: Record<string, string>) {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) throw new OmdbError(500, "Falta configurar la variable OMDB_API_KEY");

  const url = new URL(BASE_URL);
  url.searchParams.set("apikey", apiKey);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch {
    throw new OmdbError(502, "No se pudo conectar con OMDb");
  }
  if (!res.ok) {
    // Si la clave es inválida, OMDb responde 401
    throw new OmdbError(res.status === 401 ? 401 : 502, res.status === 401 ? "La clave de OMDb no es válida" : "OMDb no respondió bien");
  }
  return (await res.json()) as Record<string, unknown>;
}

/* ---------- Operaciones ---------- */
export async function getMovieById(id: string): Promise<MovieDetail | null> {
  return cached(`i:${id}`, 30 * 60_000, async () => {
    const data = await request({ i: id, plot: "full" });
    if (data.Response === "False") {
      if (typeof data.Error === "string" && /api key/i.test(data.Error)) throw new OmdbError(401, "La clave de OMDb no es válida");
      return null;
    }
    return data as unknown as MovieDetail;
  });
}

export async function searchMovies(
  query: string,
  options: { page: number; type?: string }
): Promise<SearchResponse> {
  const key = `s:${query.toLowerCase()}|${options.type ?? ""}|${options.page}`;
  return cached(key, 10 * 60_000, async () => {
    const params: Record<string, string> = { s: query, page: String(options.page) };
    if (options.type) params.type = options.type;
    const data = await request(params);

    if (data.Response === "False") {
      if (typeof data.Error === "string" && /api key/i.test(data.Error)) throw new OmdbError(401, "La clave de OMDb no es válida");
      // "Movie not found!" y "Too many results." significan simplemente: sin resultados
      return { results: [], total: 0, page: options.page };
    }
    return {
      results: (data.Search as SearchResponse["results"]) ?? [],
      total: Number(data.totalResults) || 0,
      page: options.page,
    };
  });
}

export async function getPopular(): Promise<MovieDetail[]> {
  return cached("popular", 30 * 60_000, async () => {
    const settled = await Promise.allSettled(POPULAR_IDS.map((id) => getMovieById(id)));
    const movies = settled.flatMap((r) => (r.status === "fulfilled" && r.value ? [r.value] : []));
    // Si nada respondió, se vuelve a lanzar el primer error para mostrar un mensaje claro
    if (movies.length === 0) {
      const failure = settled.find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
      if (failure) throw failure.reason;
      throw new OmdbError(502, "OMDb no devolvió películas");
    }
    return movies;
  });
}
