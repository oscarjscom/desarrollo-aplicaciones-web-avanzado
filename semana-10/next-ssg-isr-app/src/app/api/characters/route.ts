import { NextRequest, NextResponse } from "next/server";
import { ApiError, searchCharacters } from "@/lib/rickmorty";
import { validateGender, validatePage, validateStatus, validateText } from "@/lib/validation";

// El navegador llama a esta ruta; ella vuelve a validar todo en el servidor y luego consulta la API.
//   GET /api/characters?name=rick&status=alive&type=&gender=male&page=1

function bad(message: string, errors: Record<string, string>) {
  return NextResponse.json({ message, errors }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const errors: Record<string, string> = {};

  const name = validateText(params.get("name"), "Nombre");
  if (!name.ok) errors.name = name.message;

  const type = validateText(params.get("type"), "Tipo");
  if (!type.ok) errors.type = type.message;

  const status = validateStatus(params.get("status"));
  if (status === null) errors.status = "El estado debe ser alive, dead o unknown";

  const gender = validateGender(params.get("gender"));
  if (gender === null) errors.gender = "El género debe ser female, male, genderless o unknown";

  const page = validatePage(params.get("page"));
  if (page === null) errors.page = "La página debe ser un número entre 1 y 100";

  if (Object.keys(errors).length > 0) return bad("Revisa los parámetros de la búsqueda", errors);

  // Sin ningún filtro no hay nada que buscar (el listado completo ya está en la portada)
  if (!name.value && !type.value && !status && !gender) {
    return bad("Indica al menos un filtro", { filtro: "Escribe un nombre o un tipo, o elige un estado o género" });
  }

  try {
    const data = await searchCharacters({
      name: name.value,
      type: type.value,
      status: status ?? "",
      gender: gender ?? "",
      page: page ?? 1,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status === 429 ? 429 : 502 });
    }
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
