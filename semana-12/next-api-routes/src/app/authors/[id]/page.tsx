'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api, ApiError, messageOf } from '@/lib/api'
import type { Author, AuthorStats, Book, LibraryStats } from '@/lib/types'
import AuthorForm from '@/components/AuthorForm'
import BookForm from '@/components/BookForm'
import { Alert, Button, ConfirmDialog, Loading, Modal, StatCard } from '@/components/ui'

export default function AuthorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [author, setAuthor] = useState<Author | null>(null)
  const [stats, setStats] = useState<AuthorStats | null>(null)
  const [genres, setGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [notice, setNotice] = useState('')

  const [editingAuthor, setEditingAuthor] = useState(false)
  const [addingBook, setAddingBook] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [deletingBook, setDeletingBook] = useState<Book | null>(null)
  const [deletingAuthor, setDeletingAuthor] = useState(false)
  const [busy, setBusy] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const [reload, setReload] = useState(0)
  const load = () => setReload((n) => n + 1)

  useEffect(() => {
    let active = true
    Promise.all([
      api<Author>(`/api/authors/${id}`),
      api<AuthorStats>(`/api/authors/${id}/stats`),
      api<LibraryStats>('/api/stats'),
    ])
      .then(([detail, authorStats, general]) => {
        if (!active) return
        setAuthor(detail)
        setStats(authorStats)
        setGenres(general.genres.map((g) => g.name))
        setError('')
        setLoading(false)
      })
      .catch((e) => {
        if (!active) return
        if (e instanceof ApiError && e.status === 404) setNotFound(true)
        else setError(messageOf(e))
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id, reload])

  const saved = (message: string) => {
    setEditingAuthor(false)
    setAddingBook(false)
    setEditingBook(null)
    setNotice(message)
    load()
  }

  async function remove(url: string, onDone: () => void) {
    setBusy(true)
    setDeleteError('')
    try {
      await api(url, { method: 'DELETE' })
      onDone()
    } catch (e) {
      setDeleteError(messageOf(e))
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Loading label="Cargando autor…" />

  if (notFound) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-medium">Autor no encontrado</p>
        <p className="mt-1 text-sm text-muted">Puede que haya sido eliminado.</p>
        <Link href="/" className="mt-4 inline-block font-medium text-accent hover:underline">
          Volver a los autores
        </Link>
      </div>
    )
  }

  if (error || !author) {
    return <Alert>{error || 'No se pudo cargar el autor'}</Alert>
  }

  const books = author.books ?? []
  const authorOption = [{ id: author.id, name: author.name }]

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-muted hover:text-accent">
        ← Todos los autores
      </Link>

      {notice && (
        <Alert kind="ok" onClose={() => setNotice('')}>
          {notice}
        </Alert>
      )}

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{author.name}</h1>
            <p className="text-sm text-muted">{author.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditingAuthor(true)}>
              Editar autor
            </Button>
            <Button variant="ghost" onClick={() => { setDeleteError(''); setDeletingAuthor(true) }}>
              Eliminar
            </Button>
          </div>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Nacionalidad</dt>
            <dd>{author.nationality ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Año de nacimiento</dt>
            <dd>{author.birthYear ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Registrado</dt>
            <dd>{new Date(author.createdAt).toLocaleDateString('es-PE', { dateStyle: 'long' })}</dd>
          </div>
        </dl>
        {author.bio && <p className="mt-4 text-sm">{author.bio}</p>}
      </section>

      {stats && (
        <section aria-label="Estadísticas del autor" className="space-y-3">
          <h2 className="text-lg font-semibold">Estadísticas</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Libros publicados" value={stats.totalBooks} />
            <StatCard label="Páginas por libro" value={stats.averagePages || '—'} detail="promedio" />
            <StatCard
              label="Primer libro"
              value={stats.firstBook?.year ?? '—'}
              detail={stats.firstBook?.title}
            />
            <StatCard
              label="Último libro"
              value={stats.latestBook?.year ?? '—'}
              detail={stats.latestBook?.title}
            />
            <StatCard
              label="Libro más extenso"
              value={stats.longestBook?.pages ? `${stats.longestBook.pages} págs.` : '—'}
              detail={stats.longestBook?.title}
            />
            <StatCard
              label="Libro más corto"
              value={stats.shortestBook?.pages ? `${stats.shortestBook.pages} págs.` : '—'}
              detail={stats.shortestBook?.title}
            />
            <div className="col-span-2 rounded-xl border border-line bg-surface p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Géneros</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {stats.genres.length ? (
                  stats.genres.map((g) => (
                    <span key={g} className="rounded-full bg-accent-soft px-3 py-1 text-sm text-accent">
                      {g}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted">Sin géneros registrados</span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Libros ({books.length})</h2>
          <Button onClick={() => setAddingBook(true)}>Agregar libro</Button>
        </div>
        {books.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="font-medium">Este autor todavía no tiene libros</p>
            <Button className="mt-4" onClick={() => setAddingBook(true)}>
              Agregar el primero
            </Button>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <li key={book.id} className="flex flex-col rounded-xl border border-line bg-surface p-4">
                <h3 className="font-semibold">{book.title}</h3>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                  {book.genre && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-accent">{book.genre}</span>}
                  {book.publishedYear && <span>{book.publishedYear}</span>}
                  {book.pages && <span>{book.pages} págs.</span>}
                  {book.isbn && <span>ISBN {book.isbn}</span>}
                </div>
                {book.description && <p className="mt-2 line-clamp-3 text-sm">{book.description}</p>}
                <div className="mt-auto flex gap-2 pt-4">
                  <Button size="sm" variant="secondary" onClick={() => setEditingBook(book)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setDeleteError(''); setDeletingBook(book) }}>
                    Eliminar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editingAuthor && (
        <Modal title="Editar autor" onClose={() => setEditingAuthor(false)}>
          <AuthorForm initial={author} onCancel={() => setEditingAuthor(false)} onSaved={() => saved('Autor actualizado')} />
        </Modal>
      )}
      {addingBook && (
        <Modal title={`Nuevo libro de ${author.name}`} onClose={() => setAddingBook(false)}>
          <BookForm authors={authorOption} genres={genres} fixedAuthorId={author.id} onCancel={() => setAddingBook(false)} onSaved={(b) => saved(`Libro «${b.title}» agregado`)} />
        </Modal>
      )}
      {editingBook && (
        <Modal title="Editar libro" onClose={() => setEditingBook(null)}>
          <BookForm initial={editingBook} authors={authorOption} genres={genres} fixedAuthorId={author.id} onCancel={() => setEditingBook(null)} onSaved={(b) => saved(`Libro «${b.title}» actualizado`)} />
        </Modal>
      )}
      {deletingBook && (
        <ConfirmDialog
          title="Eliminar libro"
          message={
            <>
              ¿Eliminar <strong>{deletingBook.title}</strong>? Esta acción no se puede deshacer.
            </>
          }
          loading={busy}
          error={deleteError}
          onConfirm={() =>
            remove(`/api/books/${deletingBook.id}`, () => {
              setNotice(`Libro «${deletingBook.title}» eliminado`)
              setDeletingBook(null)
              load()
            })
          }
          onCancel={() => setDeletingBook(null)}
        />
      )}
      {deletingAuthor && (
        <ConfirmDialog
          title="Eliminar autor"
          message={
            <>
              ¿Eliminar a <strong>{author.name}</strong>? También se eliminarán sus {books.length} libros. Esta acción no se puede deshacer.
            </>
          }
          loading={busy}
          error={deleteError}
          onConfirm={() => remove(`/api/authors/${author.id}`, () => router.push('/'))}
          onCancel={() => setDeletingAuthor(false)}
        />
      )}
    </div>
  )
}
