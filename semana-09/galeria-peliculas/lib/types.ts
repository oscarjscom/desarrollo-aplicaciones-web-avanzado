// Formas de los datos que devuelve la API de OMDb (https://www.omdbapi.com)

export interface MovieSummary {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string; // movie | series | episode
  Poster: string; // URL o "N/A"
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface MovieDetail extends MovieSummary {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  BoxOffice?: string;
  totalSeasons?: string;
}

export interface SearchResponse {
  results: MovieSummary[];
  total: number;
  page: number;
}

export type TitleType = "movie" | "series";
