import { NextRequest, NextResponse } from "next/server";
import { OmdbError, getMovieById, searchMovies } from "@/lib/omdb";
import { validateImdbId, validatePage, validateQuery, validateType } from "@/lib/validation";

// El navegador llama a esta ruta; ella llama a OMDb con la clave guardada en el servidor.
//   GET /api/movies?s=marvel&type=movie&page=2   -> búsqueda
//   GET /api/movies?i=tt3896198                  -> detalle completo

function bad(message: string, errors: Record<string, string>) {
  return NextResponse.json({ message, errors }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  try {
    /* ---------- Detalle por id ---------- */
    if (params.has("i")) {
      const id = validateImdbId(params.get("i"));
      if (!id) return bad("Identificador inválido", { i: "Debe ser un ID de IMDb, por ejemplo tt3896198" });

      const movie = await getMovieById(id);
      if (!movie) return NextResponse.json({ message: "No se encontró ese título" }, { status: 404 });
      return NextResponse.json(movie);
    }

    /* ---------- Búsqueda ---------- */
    if (params.has("s")) {
      const errors: Record<string, string> = {};

      const query = validateQuery(params.get("s"));
      if (!query.ok) errors.s = query.message;

      let page = 1;
      if (params.has("page")) {
        const parsed = validatePage(params.get("page"));
        if (parsed === null) errors.page = "La página debe ser un número entre 1 y 100";
        else page = parsed;
      }

      let type: string | undefined;
      if (params.has("type")) {
        const parsed = validateType(params.get("type"));
        if (parsed === null) errors.type = "El tipo debe ser movie o series";
        else type = parsed;
      }

      if (Object.keys(errors).length > 0) return bad("Revisa los parámetros de la búsqueda", errors);

      return NextResponse.json(await searchMovies(query.value, { page, type }));
    }

    return bad("Falta el parámetro s (búsqueda) o i (detalle)", { s: "Obligatorio si no se envía i" });
  } catch (error) {
    if (error instanceof OmdbError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
