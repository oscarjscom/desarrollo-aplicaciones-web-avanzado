import Link from 'next/link';
import { personalInfo } from '@/lib/data';
import NavLinks from './NavLinks';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Principal"
        className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full py-1.5 pl-2 pr-1.5 sm:pl-3"
      >
        <Link
          href="/"
          aria-label={`${personalInfo.name} - Inicio`}
          className="flex items-center gap-2.5 rounded-full py-0.5 pr-2"
        >
          <span className="grid size-9 place-items-center rounded-full bg-accent font-mono text-[13px] font-semibold tracking-tight text-accent-ink">
            OO
          </span>
          <span className="hidden text-sm font-medium tracking-tight md:block">
            {personalInfo.name}
          </span>
        </Link>
        <NavLinks />
      </nav>
    </header>
  );
}
