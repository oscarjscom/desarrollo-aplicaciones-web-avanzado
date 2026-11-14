'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { validateRegister, type FieldErrors } from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError('');

    // Validación en el cliente (el servidor vuelve a validar)
    const result = validateRegister(values);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.errors) setErrors(data.errors);
        else setFormError(data?.error ?? 'No se pudo crear la cuenta');
        return;
      }
      router.push('/signIn?registered=1');
    } catch {
      setFormError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (error?: string) =>
    `w-full rounded border px-3 py-2 text-gray-900 ${
      error ? 'border-red-500' : 'border-gray-300'
    }`;

  const fields: { key: keyof typeof values; label: string; type: string; auto: string }[] = [
    { key: 'name', label: 'Nombre', type: 'text', auto: 'name' },
    { key: 'email', label: 'Correo', type: 'email', auto: 'email' },
    { key: 'password', label: 'Contraseña', type: 'password', auto: 'new-password' },
    { key: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', auto: 'new-password' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
          Crear cuenta
        </h1>

        {formError && (
          <p role="alert" className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                id={field.key}
                type={field.type}
                autoComplete={field.auto}
                value={values[field.key]}
                onChange={set(field.key)}
                className={inputClass(errors[field.key])}
              />
              {errors[field.key] && (
                <p className="mt-1 text-xs text-red-600">{errors[field.key]}</p>
              )}
            </div>
          ))}
          <p className="text-xs text-gray-500">
            Mínimo 8 caracteres, con mayúsculas, minúsculas y un número.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-700 transition disabled:opacity-60"
          >
            {loading ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/signIn" className="font-medium text-black underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
