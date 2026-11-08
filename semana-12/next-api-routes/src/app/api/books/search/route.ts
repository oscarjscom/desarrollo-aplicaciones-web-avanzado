import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { jsonError } from '@/lib/http'

const SORT_FIELDS = ['title', 'publishedYear', 'createdAt'] as const
type SortField = (typeof SORT_FIELDS)[number]

const MAX_LIMIT = 50

// Número entero positivo; null si el valor no es válido
function positiveInt(value: string | null, fallback: number) {
  if (value === null || value.trim() === '') return fallback
  const n = Number(value)
  return Number.isInteger(n) && n >= 1 ? n : null
}

// GET - Búsqueda de libros con filtros, orden y paginación
// /api/books/search?search=amor&genre=Novela&authorName=garcia&page=1&limit=10&sortBy=publishedYear&order=desc
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search')?.trim()
    const genre = searchParams.get('genre')?.trim()
    const authorName = searchParams.get('authorName')?.trim()
    const authorId = searchParams.get('authorId')?.trim()
    const sortBy = (searchParams.get('sortBy')?.trim() || 'createdAt') as SortField
    const order = searchParams.get('order')?.trim() || 'desc'

    const page = positiveInt(searchParams.get('page'), 1)
    const requestedLimit = positiveInt(searchParams.get('limit'), 10)

    if (page === null) return jsonError('page debe ser un número entero mayor a 0', 400)
    if (requestedLimit === null) return jsonError('limit debe ser un número entero mayor a 0', 400)
    if (!SORT_FIELDS.includes(sortBy)) {
      return jsonError(`sortBy debe ser uno de: ${SORT_FIELDS.join(', ')}`, 400)
    }
    if (order !== 'asc' && order !== 'desc') {
      return jsonError('order debe ser asc o desc', 400)
    }

    // El máximo de resultados por página es 50
    const limit = Math.min(requestedLimit, MAX_LIMIT)

    const where: Prisma.BookWhereInput = {
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
      ...(genre && { genre }),
      ...(authorId && { authorId }),
      ...(authorName && {
        author: { name: { contains: authorName, mode: 'insensitive' } },
      }),
    }

    const [total, data] = await prisma.$transaction([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        include: {
          author: { select: { id: true, name: true } },
        },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.log(error)
    return jsonError('Error al buscar libros', 500)
  }
}
