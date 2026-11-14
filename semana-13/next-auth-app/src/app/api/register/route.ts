import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { BCRYPT_ROUNDS } from "@/lib/security";
import { validateRegister } from "@/lib/validation";

// POST - Registrar un usuario con correo y contraseña
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo debe ser un JSON válido" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "El cuerpo debe ser un JSON válido" }, { status: 400 });
  }

  // Validación en el servidor (las mismas reglas que el formulario)
  const { valid, errors, data } = validateRegister(body as Record<string, unknown>);
  if (!valid) {
    return NextResponse.json(
      { error: Object.values(errors)[0], errors },
      { status: 400 },
    );
  }

  try {
    // La contraseña se guarda cifrada con bcrypt, nunca en texto plano
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash },
      select: { id: true, name: true, email: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo", errors: { email: "Ya existe una cuenta con ese correo" } },
        { status: 409 },
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Error al crear la cuenta" }, { status: 500 });
  }
}
