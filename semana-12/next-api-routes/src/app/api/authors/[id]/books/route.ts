import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonError } from '@/lib/http'

type Context = { params: Promise<{ id: string }> }

// GET - Obtener todos los libros de un autor específico
export async function GET(request: Request, { params }: Context) {
  try {
    const { id } = await params

    // Verificar que el autor existe
    const author = await prisma.author.findUnique({
      where: { id },
    })

    if (!author) {
      return jsonError('Autor no encontrado', 404)
    }

    // Obtener los libros del autor
    const books = await prisma.book.findMany({
      where: { authorId: id },
      orderBy: {
        publishedYear: 'desc',
      },
    })

    return NextResponse.json({
      author: {
        id: author.id,
        name: author.name,
      },
      totalBooks: books.length,
      books,
    })
  } catch {
    return jsonError('Error al obtener libros del autor', 500)
  }
}
