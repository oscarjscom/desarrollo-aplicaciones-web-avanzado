import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonError, prismaCode, readJson, validationError } from '@/lib/http'
import { validateBook } from '@/lib/validation'

type Context = { params: Promise<{ id: string }> }

// GET - Obtener un libro específico por ID
export async function GET(request: Request, { params }: Context) {
  try {
    const { id } = await params
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
      },
    })

    if (!book) {
      return jsonError('Libro no encontrado', 404)
    }

    return NextResponse.json(book)
  } catch {
    return jsonError('Error al obtener libro', 500)
  }
}

// PUT - Actualizar un libro
export async function PUT(request: Request, { params }: Context) {
  try {
    const { id } = await params
    const body = await readJson(request)
    if (!body) return jsonError('El cuerpo de la petición debe ser un JSON válido', 400)

    // Validaciones
    const { valid, errors, data } = validateBook(body, 'update')
    if (!valid) return validationError(errors)

    // Si se cambia el autor, verificar que existe
    if (data.authorId) {
      const authorExists = await prisma.author.findUnique({
        where: { id: data.authorId },
      })

      if (!authorExists) {
        return jsonError('El autor especificado no existe', 404)
      }
    }

    const book = await prisma.book.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    })

    return NextResponse.json(book)
  } catch (error) {
    if (prismaCode(error) === 'P2025') {
      return jsonError('Libro no encontrado', 404)
    }
    if (prismaCode(error) === 'P2002') {
      return jsonError('El ISBN ya existe', 409)
    }
    return jsonError('Error al actualizar libro', 500)
  }
}

// DELETE - Eliminar un libro
export async function DELETE(request: Request, { params }: Context) {
  try {
    const { id } = await params
    await prisma.book.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Libro eliminado correctamente',
    })
  } catch (error) {
    if (prismaCode(error) === 'P2025') {
      return jsonError('Libro no encontrado', 404)
    }
    return jsonError('Error al eliminar libro', 500)
  }
}
