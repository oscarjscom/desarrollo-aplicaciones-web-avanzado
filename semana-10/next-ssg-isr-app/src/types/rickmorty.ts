// Tipado de la respuesta de https://rickandmortyapi.com/documentation/#character
// Se mapean TODOS los campos que devuelve la API para un personaje.

export type CharacterStatus = "Alive" | "Dead" | "unknown";
export type CharacterGender = "Female" | "Male" | "Genderless" | "unknown";

// Enlace a otro recurso de la API (origen y ubicación)
export interface ResourceLink {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string; // casi siempre vacío
  gender: CharacterGender;
  origin: ResourceLink;
  location: ResourceLink;
  image: string; // avatar de 300x300
  episode: string[]; // URLs de los episodios donde aparece
  url: string; // URL del propio personaje
  created: string; // fecha ISO de creación en la API
}

export interface PageInfo {
  count: number; // total de personajes que cumplen el filtro
  pages: number; // total de páginas (20 personajes por página)
  next: string | null;
  prev: string | null;
}

export interface CharacterResponse {
  info: PageInfo;
  results: Character[];
}

// Filtros de la búsqueda (todos opcionales)
export interface CharacterFilters {
  name?: string;
  status?: string;
  type?: string;
  gender?: string;
  page?: number;
}
