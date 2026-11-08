import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonError } from '@/lib/http'

// GET - Estadísticas generales de la biblioteca
export async function GET() {
  try {
    const [totalAuthors, totalBooks, pages, genreGroups, topAuthor] = await Promise.all([
      prisma.author.count(),
      prisma.book.count(),
      prisma.book.aggregate({ _avg: { pages: true }, _sum: { pages: true } }),
      prisma.book.groupBy({
        by: ['genre'],
        where: { genre: { not: null } },
        _count: { _all: true },
        orderBy: { genre: 'asc' },
      }),
      prisma.author.findFirst({
        orderBy: { books: { _count: 'desc' } },
        select: { id: true, name: true, _count: { select: { books: true } } },
      }),
    ])

    return NextResponse.json({
      totalAuthors,
      totalBooks,
      averagePages: Math.round(pages._avg.pages ?? 0),
      totalPages: pages._sum.pages ?? 0,
      genres: genreGroups.map((g) => ({ name: g.genre as string, books: g._count._all })),
      topAuthor:
        topAuthor && topAuthor._count.books > 0
          ? { id: topAuthor.id, name: topAuthor.name, books: topAuthor._count.books }
          : null,
    })
  } catch (error) {
    console.log(error)
    return jsonError('Error al obtener las estadísticas', 500)
  }
}
