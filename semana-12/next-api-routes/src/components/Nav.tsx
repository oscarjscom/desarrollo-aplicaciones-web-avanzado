'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Autores' },
  { href: '/books', label: 'Libros' },
]

export default function Nav() {
  const pathname = usePathname()
  const active = (href: string) => (href === '/' ? pathname === '/' || pathname.startsWith('/authors') : pathname.startsWith(href))

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Biblioteca
        </Link>
        <nav className="flex gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active(link.href) ? 'page' : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                active(link.href) ? 'bg-accent-soft text-accent' : 'text-muted hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
