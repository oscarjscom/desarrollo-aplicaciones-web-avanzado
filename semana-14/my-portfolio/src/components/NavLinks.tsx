'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/projects', label: 'Proyectos' },
  { href: '/about', label: 'Sobre mí' },
  { href: '/contact', label: 'Contacto' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-0.5 sm:gap-1">
      {links.map(({ href, label }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`rounded-full px-2.5 py-1.5 text-[13px] transition-colors duration-300 sm:px-3.5 sm:text-sm ${
                active
                  ? 'bg-white/10 text-fg'
                  : 'text-mute hover:bg-white/5 hover:text-fg'
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
