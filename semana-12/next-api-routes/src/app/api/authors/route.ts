import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonError, prismaCode, readJson, validationError } from '@/lib/http'
import { validateAuthor } from '@/lib/validation'

// GET - Obtener todos los autores
export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      include: {
        books: true,
        _count: {
          select: { books: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(authors)
  } catch (error) {
    console.log(error)
    return jsonError('Error al obtener autores', 500)
  }
}

// POST - Crear un nuevo autor
export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    if (!body) return jsonError('El cuerpo de la petición debe ser un JSON válido', 400)

    // Validación (nombre, email y formato de los demás campos)
    const { valid, errors, data } = validateAuthor(body, 'create')
    if (!valid) return validationError(errors)

    const author = await prisma.author.create({
      data: {
        name: data.name!,
        email: data.email!,
        bio: data.bio,
        nationality: data.nationality,
        birthYear: data.birthYear,
      },
      include: {
        books: true,
      },
    })

    return NextResponse.json(author, { status: 201 })
  } catch (error) {
    if (prismaCode(error) === 'P2002') {
      return jsonError('El email ya está registrado', 409)
    }
    console.log(error)
    return jsonError('Error al crear autor', 500)
  }
}
