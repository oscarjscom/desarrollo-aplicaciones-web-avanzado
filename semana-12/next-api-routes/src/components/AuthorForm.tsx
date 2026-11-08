'use client'

import { useState, type FormEvent } from 'react'
import { api, ApiError, messageOf } from '@/lib/api'
import type { Author } from '@/lib/types'
import { validateAuthor, type FieldErrors } from '@/lib/validation'
import { Alert, Button, Field, inputClass } from '@/components/ui'

export default function AuthorForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Author
  onSaved: (author: Author) => void
  onCancel: () => void
}) {
  const [values, setValues] = useState({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    nationality: initial?.nationality ?? '',
    birthYear: initial?.birthYear?.toString() ?? '',
    bio: initial?.bio ?? '',
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
    if (key) document.getElementById(`author-${key}`)?.focus()
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setServerError('')

    // Validación en el cliente (las mismas reglas se repiten en el servidor)
    const result = validateAuthor(values, 'create')
    if (!result.valid) {
      setErrors(result.errors)
      focusFirst(result.errors)
      return
    }

    setSaving(true)
    try {
      const author = await api<Author>(initial ? `/api/authors/${initial.id}` : '/api/authors', {
        method: initial ? 'PUT' : 'POST',
        json: values,
      })
      onSaved(author)
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors)
        focusFirst(error.errors)
      } else if (error instanceof ApiError && error.status === 409) {
        setErrors({ email: error.message })
        focusFirst({ email: error.message })
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
        <Field id="author-name" label="Nombre" required error={errors.name}>
          <input id="author-name" autoFocus value={values.name} onChange={set('name')} className={inputClass(errors.name)} placeholder="Gabriel García Márquez" aria-invalid={!!errors.name} />
        </Field>
        <Field id="author-email" label="Email" required error={errors.email}>
          <input id="author-email" type="email" value={values.email} onChange={set('email')} className={inputClass(errors.email)} placeholder="autor@example.com" aria-invalid={!!errors.email} />
        </Field>
        <Field id="author-nationality" label="Nacionalidad" error={errors.nationality}>
          <input id="author-nationality" value={values.nationality} onChange={set('nationality')} className={inputClass(errors.nationality)} placeholder="Colombia" />
        </Field>
        <Field id="author-birthYear" label="Año de nacimiento" error={errors.birthYear}>
          <input id="author-birthYear" inputMode="numeric" value={values.birthYear} onChange={set('birthYear')} className={inputClass(errors.birthYear)} placeholder="1927" aria-invalid={!!errors.birthYear} />
        </Field>
      </div>
      <Field id="author-bio" label="Biografía" error={errors.bio} hint={`${values.bio.length}/500`}>
        <textarea id="author-bio" rows={3} value={values.bio} onChange={set('bio')} className={inputClass(errors.bio)} placeholder="Premio Nobel de Literatura 1982" />
      </Field>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {initial ? 'Guardar cambios' : 'Crear autor'}
        </Button>
      </div>
    </form>
  )
}
