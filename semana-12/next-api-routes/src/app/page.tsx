'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api, messageOf } from '@/lib/api'
import type { Author, LibraryStats } from '@/lib/types'
import AuthorForm from '@/components/AuthorForm'
import { Alert, Button, ConfirmDialog, Loading, Modal, StatCard } from '@/components/ui'

export default function DashboardPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [stats, setStats] = useState<LibraryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [notice, setNotice] = useState('')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Author | null>(null)
  const [deleting, setDeleting] = useState<Author | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const [reload, setReload] = useState(0)
  const load = () => setReload((n) => n + 1)

  useEffect(() => {
    let active = true
    Promise.all([api<Author[]>('/api/authors'), api<LibraryStats>('/api/stats')])
      .then(([list, general]) => {
        if (!active) return
        setAuthors(list)
        setStats(general)
        setLoadError('')
        setLoading(false)
      })
      .catch((error) => {
        if (!active) return
        setLoadError(messageOf(error))
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reload])

  const saved = (message: string) => {
    setCreating(false)
    setEditing(null)
    setNotice(message)
    load()
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeleteBusy(true)
    setDeleteError('')
    try {
      await api(`/api/authors/${deleting.id}`, { method: 'DELETE' })
      setNotice(`Autor «${deleting.name}» eliminado`)
      setDeleting(null)
      load()
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
          <h1 className="text-2xl font-semibold tracking-tight">Autores</h1>
          <p className="text-sm text-muted">Administra los autores de la biblioteca y revisa sus libros.</p>
        </div>
        <Button onClick={() => setCreating(true)}>Nuevo autor</Button>
      </div>

      {notice && (
        <Alert kind="ok" onClose={() => setNotice('')}>
          {notice}
        </Alert>
      )}

      {loading ? (
        <Loading label="Cargando autores…" />
      ) : loadError ? (
        <Alert>
          {loadError}{' '}
          <button type="button" className="font-medium underline" onClick={() => { setLoading(true); load() }}>
            Reintentar
          </button>
        </Alert>
      ) : (
        <>
          {stats && (
            <section aria-label="Estadísticas generales" className="space-y-3">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard label="Autores" value={stats.totalAuthors} />
                <StatCard label="Libros" value={stats.totalBooks} />
                <StatCard label="Páginas por libro" value={stats.averagePages} detail={`${stats.totalPages.toLocaleString('es-PE')} páginas en total`} />
                <StatCard label="Autor con más libros" value={stats.topAuthor?.books ?? 0} detail={stats.topAuthor?.name ?? 'Aún no hay libros'} />
              </div>
              {stats.genres.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted">Géneros:</span>
                  {stats.genres.map((genre) => (
                    <Link key={genre.name} href={`/books?genre=${encodeURIComponent(genre.name)}`} className="rounded-full bg-accent-soft px-3 py-1 text-accent hover:opacity-80">
                      {genre.name} · {genre.books}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

          {authors.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
              <p className="font-medium">Todavía no hay autores</p>
              <p className="mt-1 text-sm text-muted">Crea el primero para empezar a registrar libros.</p>
              <Button className="mt-4" onClick={() => setCreating(true)}>
                Nuevo autor
              </Button>
            </div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {authors.map((author) => (
                <li key={author.id} className="flex flex-col rounded-xl border border-line bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold">{author.name}</h2>
                      <p className="truncate text-sm text-muted">{author.email}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                      {author._count?.books ?? 0} {(author._count?.books ?? 0) === 1 ? 'libro' : 'libros'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {[author.nationality, author.birthYear && `n. ${author.birthYear}`].filter(Boolean).join(' · ') || 'Sin datos adicionales'}
                  </p>
                  {author.bio && <p className="mt-2 line-clamp-2 text-sm">{author.bio}</p>}
                  <div className="mt-4 flex flex-wrap gap-2 pt-1">
                    <Link href={`/authors/${author.id}`} className="inline-flex items-center rounded-lg bg-accent px-2.5 py-1 text-sm font-medium text-accent-ink hover:opacity-90">
                      Ver libros
                    </Link>
                    <Button size="sm" variant="secondary" onClick={() => setEditing(author)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setDeleteError(''); setDeleting(author) }}>
                      Eliminar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {creating && (
        <Modal title="Nuevo autor" onClose={() => setCreating(false)}>
          <AuthorForm onCancel={() => setCreating(false)} onSaved={(a) => saved(`Autor «${a.name}» creado`)} />
        </Modal>
      )}
      {editing && (
        <Modal title="Editar autor" onClose={() => setEditing(null)}>
          <AuthorForm initial={editing} onCancel={() => setEditing(null)} onSaved={(a) => saved(`Autor «${a.name}» actualizado`)} />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar autor"
          message={
            <>
              ¿Eliminar a <strong>{deleting.name}</strong>? También se eliminarán sus {deleting._count?.books ?? 0} libros. Esta acción no se puede deshacer.
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
