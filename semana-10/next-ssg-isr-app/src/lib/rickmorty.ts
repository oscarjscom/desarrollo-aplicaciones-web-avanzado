import type { Character, CharacterFilters, CharacterResponse } from "@/types/rickmorty";

const API = "https://rickandmortyapi.com/api/character";

// Los personajes casi no cambian: se revalidan cada 10 días (ISR).
// Debe coincidir con `export const revalidate = 864000` de las páginas (allí tiene que ser un número literal).
export const REVALIDATE_SECONDS = 864000;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// fetch con reintentos: la API responde 429 si se le piden demasiadas cosas seguidas
async function apiFetch(url: string, init: RequestInit & { next?: { revalidate: number } }): Promise<Response> {
  let res = await fetch(url, init);
  for (let attempt = 1; res.status === 429 && attempt <= 4; attempt++) {
    const retryAfter = Number(res.headers.get("retry-after"));
    await wait(retryAfter > 0 ? retryAfter * 1000 : 1200 * attempt);
    res = await fetch(url, init);
  }
  return res;
}

/* ---------- Página de personajes con caché forzada (SSG + ISR) ---------- */
// `cache: "force-cache"` guarda la respuesta; `revalidate` la renueva cada 10 días.
async function fetchCatalogPage(page: number): Promise<CharacterResponse> {
  const res = await apiFetch(`${API}?page=${page}`, {
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new ApiError("No se pudieron cargar los personajes", res.status);
  return res.json();
}

export async function getFirstPage(): Promise<CharacterResponse> {
  return fetchCatalogPage(1);
}

// Catálogo completo (826 personajes en 42 páginas de la API). Cada página del listado ya trae todos
// los campos, así que en el build se descarga una sola vez en vez de pedir 826 fichas por separado.
let loading: Promise<Character[]> | null = null;

async function loadAll(): Promise<Character[]> {
  const first = await fetchCatalogPage(1);
  const rest: CharacterResponse[] = [];
  const pages = Array.from({ length: first.info.pages - 1 }, (_, i) => i + 2);

  // En tandas de 6 para no saturar la API
  for (let i = 0; i < pages.length; i += 6) {
    rest.push(...(await Promise.all(pages.slice(i, i + 6).map(fetchCatalogPage))));
  }
  return [first, ...rest].flatMap((p) => p.results).sort((a, b) => a.id - b.id);
}

export function getAllCharacters(): Promise<Character[]> {
  // Las llamadas simultáneas comparten la misma descarga; las siguientes salen del caché de fetch.
  loading ??= loadAll().finally(() => {
    loading = null;
  });
  return loading;
}

export async function getCharacter(id: number): Promise<Character | null> {
  // Al construir se usa el catálogo completo (42 peticiones en total). En tiempo de ejecución (una ficha que
  // no se generó, o su revalidación cada 10 días) se pide solo ese personaje: así no se pasa del tiempo
  // máximo de una función y un Id que no existe termina en 404 en vez de en un error.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    const all = await getAllCharacters();
    return all.find((character) => character.id === id) ?? null;
  }

  const res = await apiFetch(`${API}/${id}`, {
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError("No se pudo cargar el personaje", res.status);
  return res.json();
}

/* ---------- Búsqueda (se usa desde la ruta /api/characters) ---------- */
export async function searchCharacters(filters: CharacterFilters): Promise<CharacterResponse> {
  const params = new URLSearchParams();
  if (filters.name) params.set("name", filters.name);
  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);
  if (filters.gender) params.set("gender", filters.gender);
  params.set("page", String(filters.page ?? 1));

  const res = await apiFetch(`${API}?${params}`, { next: { revalidate: 600 } });

  // La API responde 404 cuando ningún personaje cumple el filtro: aquí es "cero resultados", no un error
  if (res.status === 404) {
    return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
  }
  if (!res.ok) throw new ApiError("No se pudo consultar la API de Rick and Morty", res.status);
  return res.json();
}
