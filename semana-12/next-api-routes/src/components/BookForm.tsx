'use client'

import { useState, type FormEvent } from 'react'
import { api, ApiError, messageOf } from '@/lib/api'
import type { Book } from '@/lib/types'
import { validateBook, type FieldErrors } from '@/lib/validation'
import { Alert, Button, Field, inputClass } from '@/components/ui'

export default function BookForm({
  initial,
  authors,
  genres = [],
  fixedAuthorId,
  onSaved,
  onCancel,
}: {
  initial?: Book
  authors: { id: string; name: string }[]
  genres?: string[]
  fixedAuthorId?: string
  onSaved: (book: Book) => void
  onCancel: () => void
}) {
  const [values, setValues] = useState({
    title: initial?.title ?? '',
    authorId: initial?.authorId ?? fixedAuthorId ?? '',
    isbn: initial?.isbn ?? '',
    genre: initial?.genre ?? '',
    publishedYear: initial?.publishedYear?.toString() ?? '',
    pages: initial?.pages?.toString() ?? '',
    description: initial?.description ?? '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (key: keyof typeof values) => (event: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: event.target.value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const focusFirst = (found: FieldErrors) => {
    const key = Object.keys(found).find((k) => found[k])
    if (key) document.getElementById(`book-${key}`)?.focus()
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setServerError('')

    // Validación en el cliente (las mismas reglas se repiten en el servidor)
    const result = validateBook(values, 'create')
    if (!result.valid) {
      setErrors(result.errors)
      focusFirst(result.errors)
      return
    }

    setSaving(true)
    try {
      const book = await api<Book>(initial ? `/api/books/${initial.id}` : '/api/books', {
        method: initial ? 'PUT' : 'POST',
        json: values,
      })
      onSaved(book)
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors)
        focusFirst(error.errors)
      } else if (error instanceof ApiError && error.status === 409) {
        setErrors({ isbn: error.message })
        focusFirst({ isbn: error.message })
      } else {
        setServerError(messageOf(error))
      }
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {serverError && <Alert>{serverError}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="book-title" label="Título" required error={errors.title}>
            <input id="book-title" autoFocus value={values.title} onChange={set('title')} className={inputClass(errors.title)} placeholder="Cien años de soledad" aria-invalid={!!errors.title} />
          </Field>
        </div>
        <Field id="book-authorId" label="Autor" required error={errors.authorId}>
          <select id="book-authorId" value={values.authorId} onChange={set('authorId')} disabled={!!fixedAuthorId} className={inputClass(errors.authorId)} aria-invalid={!!errors.authorId}>
            <option value="">Selecciona un autor</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="book-genre" label="Género" error={errors.genre}>
          <input id="book-genre" list="book-genres" value={values.genre} onChange={set('genre')} className={inputClass(errors.genre)} placeholder="Novela" />
          <datalist id="book-genres">
            {genres.map((genre) => (
              <option key={genre} value={genre} />
            ))}
          </datalist>
        </Field>
        <Field id="book-isbn" label="ISBN" error={errors.isbn}>
          <input id="book-isbn" value={values.isbn} onChange={set('isbn')} className={inputClass(errors.isbn)} placeholder="978-0307474728" aria-invalid={!!errors.isbn} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field id="book-publishedYear" label="Año" error={errors.publishedYear}>
            <input id="book-publishedYear" inputMode="numeric" value={values.publishedYear} onChange={set('publishedYear')} className={inputClass(errors.publishedYear)} placeholder="1967" aria-invalid={!!errors.publishedYear} />
          </Field>
          <Field id="book-pages" label="Páginas" error={errors.pages}>
            <input id="book-pages" inputMode="numeric" value={values.pages} onChange={set('pages')} className={inputClass(errors.pages)} placeholder="417" aria-invalid={!!errors.pages} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="book-description" label="Descripción" error={errors.description} hint={`${values.description.length}/1000`}>
            <textarea id="book-description" rows={3} value={values.description} onChange={set('description')} className={inputClass(errors.description)} placeholder="Obra maestra del realismo mágico" />
          </Field>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {initial ? 'Guardar cambios' : 'Crear libro'}
        </Button>
      </div>
    </form>
  )
}
