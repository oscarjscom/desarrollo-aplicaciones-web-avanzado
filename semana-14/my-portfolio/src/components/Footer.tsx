import Link from 'next/link';
import { personalInfo } from '@/lib/data';
import { ArrowUpRight } from './Icons';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="max-w-sm text-2xl font-medium leading-tight tracking-tight">
            ¿Tienes una idea o un proyecto en mente?
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition duration-300 hover:-translate-y-px active:scale-[0.98]"
          >
            Escríbeme
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <nav aria-label="Pie de página">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-mute">
            Navegación
          </p>
          <ul className="space-y-2.5 text-sm">
            {[
              ['/', 'Inicio'],
              ['/projects', 'Proyectos'],
              ['/about', 'Sobre mí'],
              ['/contact', 'Contacto'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-fg/80 transition hover:text-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-mute">
            En línea
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center gap-1.5 text-fg/80 transition hover:text-accent"
              >
                GitHub
                <ArrowUpRight className="size-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-6 font-mono text-xs text-mute sm:flex-row sm:justify-between sm:px-6">
          <span>
            © {new Date().getFullYear()} {personalInfo.name}
          </span>
          <span>Hecho con Next.js y Tailwind CSS</span>
        </p>
      </div>
    </footer>
  );
}
