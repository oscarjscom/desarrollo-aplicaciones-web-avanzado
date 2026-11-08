'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { api, messageOf } from '@/lib/api'
import type { Author, Book, BookSearch, LibraryStats } from '@/lib/types'
import BookForm from '@/components/BookForm'
import { Alert, Button, ConfirmDialog, Field, inputClass, Modal, Pagination, Spinner } from '@/components/ui'

type Result = { key: string; data?: BookSearch; error?: string }

export default function BooksView() {
  const initialGenre = useSearchParams().get('genre') ?? ''

  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState(initialGenre)
  const [authorId, setAuthorId] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [reload, setReload] = useState(0)

  const [authors, setAuthors] = useState<Pick<Author, 'id' | 'name'>[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [result, setResult] = useState<Result | null>(null)

  const [notice, setNotice] = useState('')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Book | null>(null)
  const [deleting, setDeleting] = useState<Book | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Búsqueda en tiempo real: se espera un momento después de la última tecla
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Autores y géneros disponibles para los filtros y el formulario
  useEffect(() => {
    let active = true
    Promise.all([api<Author[]>('/api/authors'), api<LibraryStats>('/api/stats')])
      .then(([list, stats]) => {
        if (!active) return
        setAuthors(list.map(({ id, name }) => ({ id, name })))
        setGenres(stats.genres.map((g) => g.name))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [reload])

  const params = new URLSearchParams({ page: String(page), limit: String(limit), sortBy, order })
  if (search) params.set('search', search)
  if (genre) params.set('genre', genre)
  if (authorId) params.set('authorId', authorId)
  const key = `${params.toString()}#${reload}`

  useEffect(() => {
    const controller = new AbortController()
    api<BookSearch>(`/api/books/search?${key.split('#')[0]}`, { signal: controller.signal })
      .then((data) => setResult({ key, data }))
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ key, error: messageOf(error) })
      })
    return () => controller.abort()
  }, [key])

  const loading = result?.key !== key
  const data = result?.data
  const filtered = !!(search || genre || authorId)

  const clear = () => {
    setQuery('')
    setSearch('')
    setGenre('')
    setAuthorId('')
    setPage(1)
  }

  const saved = useCallback((message: string) => {
    setCreating(false)
    setEditing(null)
    setNotice(message)
    setReload((n) => n + 1)
  }, [])

  async function confirmDelete() {
    if (!deleting) return
    setDeleteBusy(true)
    setDeleteError('')
    try {
      await api(`/api/books/${deleting.id}`, { method: 'DELETE' })
      setNotice(`Libro «${deleting.title}» eliminado`)
      setDeleting(null)
      if (data && data.data.length === 1 && page > 1) setPage(page - 1)
      setReload((n) => n + 1)
    } catch (error) {
      setDeleteError(messageOf(error))
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Libros</h1>
          <p className="text-sm text-muted">Busca por título, filtra por género o autor y ordena los resultados.</p>
        </div>
        <Button onClick={() => setCreating(true)}>Nuevo libro</Button>
      </div>

      {notice && (
        <Alert kind="ok" onClose={() => setNotice('')}>
          {notice}
        </Alert>
      )}

      <section aria-label="Filtros" className="grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="sm:col-span-2 lg:col-span-2">
          <Field id="f-search" label="Buscar por título">
            <div className="relative">
              <input id="f-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} className={inputClass()} placeholder="Escribe para buscar…" />
              {(loading || query.trim() !== search) && (
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted">
                  <Spinner />
                </span>
              )}
            </div>
          </Field>
        </div>
        <Field id="f-genre" label="Género">
          <select id="f-genre" value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1) }} className={inputClass()}>
            <option value="">Todos</option>
            {genre && !genres.includes(genre) && <option value={genre}>{genre}</option>}
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>
        <Field id="f-author" label="Autor">
          <select id="f-author" value={authorId} onChange={(e) => { setAuthorId(e.target.value); setPage(1) }} className={inputClass()}>
            <option value="">Todos</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="f-sort" label="Ordenar por">
          <select id="f-sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1) }} className={inputClass()}>
            <option value="createdAt">Fecha de creación</option>
            <option value="title">Título</option>
            <option value="publishedYear">Año de publicación</option>
          </select>
        </Field>
        <Field id="f-order" label="Orden">
          <select id="f-order" value={order} onChange={(e) => { setOrder(e.target.value); setPage(1) }} className={inputClass()}>
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </Field>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p aria-live="polite" className="text-muted">
          {data ? (
            <>
              <strong className="text-ink">{data.pagination.total}</strong> {data.pagination.total === 1 ? 'resultado' : 'resultados'}
              {data.pagination.totalPages > 0 && <> · página {data.pagination.page} de {data.pagination.totalPages}</>}
            </>
          ) : (
            'Buscando…'
          )}
        </p>
        <div className="flex items-center gap-3">
          {filtered && (
            <button type="button" onClick={clear} className="font-medium text-accent hover:underline">
              Limpiar filtros
            </button>
          )}
          <label className="flex items-center gap-2 text-muted">
            Por página
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }} className="rounded-lg border border-line bg-surface px-2 py-1 text-ink">
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {result?.error && !data ? (
        <Alert>{result.error}</Alert>
      ) : !data ? (
        <div role="status" className="flex items-center justify-center gap-2 py-16 text-muted">
          <Spinner className="size-5" /> Buscando libros…
        </div>
      ) : (
        <div className={`space-y-5 transition-opacity ${loading ? 'opacity-50' : ''}`} aria-busy={loading}>
          {result?.error && <Alert>{result.error}</Alert>}
          {data.data.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
              <p className="font-medium">{filtered ? 'No se encontraron libros con esos filtros' : 'Todavía no hay libros'}</p>
              <p className="mt-1 text-sm text-muted">{filtered ? 'Prueba con otra búsqueda o limpia los filtros.' : 'Crea el primero con el botón «Nuevo libro».'}</p>
            </div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.data.map((book) => (
                <li key={book.id} className="flex flex-col rounded-xl border border-line bg-surface p-4">
                  <h2 className="font-semibold">{book.title}</h2>
                  <p className="text-sm text-muted">
                    <Link href={`/authors/${book.author?.id}`} className="hover:text-accent hover:underline">
                      {book.author?.name}
                    </Link>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                    {book.genre && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-accent">{book.genre}</span>}
                    {book.publishedYear && <span>{book.publishedYear}</span>}
                    {book.pages && <span>{book.pages} págs.</span>}
                    {book.isbn && <span>ISBN {book.isbn}</span>}
                  </div>
                  {book.description && <p className="mt-2 line-clamp-2 text-sm">{book.description}</p>}
                  <div className="mt-auto flex gap-2 pt-4">
                    <Button size="sm" variant="secondary" onClick={() => setEditing(book)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setDeleteError(''); setDeleting(book) }}>
                      Eliminar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={setPage} disabled={loading} />
        </div>
      )}

      {creating && (
        <Modal title="Nuevo libro" onClose={() => setCreating(false)}>
          <BookForm authors={authors} genres={genres} onCancel={() => setCreating(false)} onSaved={(b) => saved(`Libro «${b.title}» creado`)} />
        </Modal>
      )}
      {editing && (
        <Modal title="Editar libro" onClose={() => setEditing(null)}>
          <BookForm initial={editing} authors={authors} genres={genres} onCancel={() => setEditing(null)} onSaved={(b) => saved(`Libro «${b.title}» actualizado`)} />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar libro"
          message={
            <>
              ¿Eliminar <strong>{deleting.title}</strong>? Esta acción no se puede deshacer.
            </>
          }
          loading={deleteBusy}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
