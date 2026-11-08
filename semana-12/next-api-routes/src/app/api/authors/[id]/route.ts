import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonError, prismaCode, readJson, validationError } from '@/lib/http'
import { validateAuthor } from '@/lib/validation'

type Context = { params: Promise<{ id: string }> }

// GET - Obtener un autor específico por ID
export async function GET(request: Request, { params }: Context) {
  try {
    const { id } = await params
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          orderBy: {
            publishedYear: 'desc',
          },
        },
        _count: {
          select: { books: true },
        },
      },
    })

    if (!author) {
      return jsonError('Autor no encontrado', 404)
    }

    return NextResponse.json(author)
  } catch {
    return jsonError('Error al obtener autor', 500)
  }
}

// PUT - Actualizar un autor
export async function PUT(request: Request, { params }: Context) {
  try {
    const { id } = await params
    const body = await readJson(request)
    if (!body) return jsonError('El cuerpo de la petición debe ser un JSON válido', 400)

    // Validación
    const { valid, errors, data } = validateAuthor(body, 'update')
    if (!valid) return validationError(errors)

    const author = await prisma.author.update({
      where: { id },
      data,
      include: {
        books: true,
      },
    })

    return NextResponse.json(author)
  } catch (error) {
    if (prismaCode(error) === 'P2025') {
      return jsonError('Autor no encontrado', 404)
    }
    if (prismaCode(error) === 'P2002') {
      return jsonError('El email ya está registrado', 409)
    }
    return jsonError('Error al actualizar autor', 500)
  }
}

// DELETE - Eliminar un autor (sus libros se eliminan en cascada)
export async function DELETE(request: Request, { params }: Context) {
  try {
    const { id } = await params
    await prisma.author.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Autor eliminado correctamente',
    })
  } catch (error) {
    if (prismaCode(error) === 'P2025') {
      return jsonError('Autor no encontrado', 404)
    }
    return jsonError('Error al eliminar autor', 500)
  }
}
