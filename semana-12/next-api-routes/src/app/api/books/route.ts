import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonError, prismaCode, readJson, validationError } from '@/lib/http'
import { validateBook } from '@/lib/validation'

// GET - Obtener todos los libros (filtros opcionales: genre y authorId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')
    const authorId = searchParams.get('authorId')

    const books = await prisma.book.findMany({
      where: {
        ...(genre && { genre }),
        ...(authorId && { authorId }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(books)
  } catch {
    return jsonError('Error al obtener libros', 500)
  }
}

// POST - Crear un nuevo libro
export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    if (!body) return jsonError('El cuerpo de la petición debe ser un JSON válido', 400)

    // Validaciones (título, autor, páginas, año e ISBN)
    const { valid, errors, data } = validateBook(body, 'create')
    if (!valid) return validationError(errors)

    // Verificar que el autor existe
    const authorExists = await prisma.author.findUnique({
      where: { id: data.authorId },
    })

    if (!authorExists) {
      return jsonError('El autor especificado no existe', 404)
    }

    const book = await prisma.book.create({
      data: {
        title: data.title!,
        description: data.description,
        isbn: data.isbn,
        publishedYear: data.publishedYear,
        genre: data.genre,
        pages: data.pages,
        authorId: data.authorId!,
      },
      include: {
        author: true,
      },
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    if (prismaCode(error) === 'P2002') {
      return jsonError('El ISBN ya existe', 409)
    }
    console.log(error)
    return jsonError('Error al crear libro', 500)
  }
}
