'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { validateLogin, type FieldErrors } from '@/lib/validation';

// Traduce el error que lanza NextAuth (INVALID, INVALID:n o LOCKED:min) a un mensaje
function messageFor(error: string): string {
  if (error.startsWith('LOCKED:')) {
    const minutes = Number(error.split(':')[1]);
    return `Cuenta bloqueada por demasiados intentos fallidos. Intenta de nuevo en ${minutes} ${
      minutes === 1 ? 'minuto' : 'minutos'
    }.`;
  }
  if (error.startsWith('INVALID:')) {
    const left = Number(error.split(':')[1]);
    return `Correo o contraseña incorrectos. Te ${left === 1 ? 'queda 1 intento' : `quedan ${left} intentos`} antes de que se bloquee la cuenta.`;
  }
  if (error === 'INVALID' || error === 'CredentialsSignin') {
    return 'Correo o contraseña incorrectos.';
  }
  return 'No se pudo iniciar sesión. Inténtalo de nuevo.';
}

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const registered = params.get('registered') === '1';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const callbackUrl = params.get('callbackUrl') ?? '/dashboard';

  async function handleCredentials(event: FormEvent) {
    event.preventDefault();
    setFormError('');

    // Validación en el cliente (el servidor vuelve a validar)
    const result = validateLogin({ email, password });
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});

    setLoading(true);
    const response = await signIn('credentials', {
      email: result.data.email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (response?.error) {
      setFormError(messageFor(response.error));
      setPassword('');
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  const handleProvider = (provider: 'google' | 'github') => async () => {
    const result = await signIn(provider, { callbackUrl, redirect: false });
    if (result?.ok) {
      router.push(callbackUrl);
    }
  };

  const inputClass = (error?: string) =>
    `w-full rounded border px-3 py-2 text-gray-900 ${
      error ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
          Sign In
        </h1>

        {registered && (
          <p role="status" className="mb-4 rounded bg-green-100 px-3 py-2 text-sm text-green-800">
            Cuenta creada. Ya puedes iniciar sesión.
          </p>
        )}
        {formError && (
          <p role="alert" className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
            {formError}
          </p>
        )}

        <form onSubmit={handleCredentials} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(errors.email)}
              placeholder="tu@correo.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass(errors.password)}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-700 transition disabled:opacity-60"
          >
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          o continúa con
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleProvider('google')}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
          >
            <FaGoogle />
            Continue with Google
          </button>
          <button
            onClick={handleProvider('github')}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
          >
            <FaGithub />
            Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-medium text-black underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
