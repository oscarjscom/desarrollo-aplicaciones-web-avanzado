export type Book = {
  id: string
  title: string
  description: string | null
  isbn: string | null
  publishedYear: number | null
  genre: string | null
  pages: number | null
  authorId: string
  createdAt: string
  updatedAt: string
  author?: { id: string; name: string; email?: string }
}

export type Author = {
  id: string
  name: string
  email: string
  bio: string | null
  nationality: string | null
  birthYear: number | null
  createdAt: string
  updatedAt: string
  books?: Book[]
  _count?: { books: number }
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type BookSearch = { data: Book[]; pagination: Pagination }

export type LibraryStats = {
  totalAuthors: number
  totalBooks: number
  averagePages: number
  totalPages: number
  genres: { name: string; books: number }[]
  topAuthor: { id: string; name: string; books: number } | null
}

export type AuthorStats = {
  authorId: string
  authorName: string
  totalBooks: number
  firstBook: { title: string; year: number | null } | null
  latestBook: { title: string; year: number | null } | null
  averagePages: number
  genres: string[]
  longestBook: { title: string; pages: number | null } | null
  shortestBook: { title: string; pages: number | null } | null
}
