'use client';

import { useState, type FormEvent } from 'react';
import { validateContact, type FieldErrors } from '@/lib/validation';
import { Check } from './Icons';

const initial = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof initial) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    setSent(false);

    // Validación en el cliente (el servidor vuelve a validar)
    const result = validateContact(values);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.errors) setErrors(data.errors);
        else setFormError(data?.error ?? 'No se pudo enviar el mensaje');
        return;
      }
      setSent(true);
      setValues(initial);
    } catch {
      setFormError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (error?: string) =>
    `w-full rounded-xl border bg-bg px-4 py-3 text-fg placeholder:text-mute/60 transition-colors duration-300 focus:border-accent focus:outline-none ${
      error ? 'border-red-400' : 'border-line hover:border-fg/30'
    }`;
  const labelClass = 'mb-2 block font-mono text-xs uppercase tracking-widest text-mute';
  const errorClass = 'mt-2 text-sm text-red-300';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {sent && (
        <p
          role="status"
          className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-accent"
        >
          <Check className="size-5 shrink-0" />
          ¡Gracias! Tu mensaje fue recibido.
        </p>
      )}
      {formError && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-red-200">
          {formError}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Nombre
          </label>
          <input id="name" autoComplete="name" value={values.name} onChange={set('name')} className={inputClass(errors.name)} />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Correo
          </label>
          <input id="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} className={inputClass(errors.email)} />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Asunto
        </label>
        <input id="subject" value={values.subject} onChange={set('subject')} className={inputClass(errors.subject)} />
        {errors.subject && <p className={errorClass}>{errors.subject}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Mensaje
        </label>
        <textarea id="message" rows={6} value={values.message} onChange={set('message')} className={`${inputClass(errors.message)} resize-y`} />
        <div className="mt-2 flex justify-between gap-4 text-sm">
          <span className="text-red-300">{errors.message}</span>
          <span className="font-mono text-mute">{values.message.length}/1000</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-accent-ink transition duration-300 hover:-translate-y-px active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
