import Link from 'next/link';
import { ArrowLeft } from '@/components/Icons';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-6xl flex-col items-start justify-center px-5 py-20 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Error 404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tighter sm:text-5xl">
        Esta página no existe
      </h1>
      <p className="mt-4 max-w-[44ch] text-lg text-mute">
        Puede que el enlace haya cambiado o que el proyecto ya no esté publicado.
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium transition duration-300 hover:border-fg/40 active:scale-[0.98]"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Volver al inicio
      </Link>
    </div>
  );
}
