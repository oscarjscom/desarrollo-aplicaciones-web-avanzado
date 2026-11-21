import Link from 'next/link';
import { personalInfo } from '@/lib/data';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            {personalInfo.name}
          </Link>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-700 transition"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="text-gray-700 hover:text-blue-700 transition"
              >
                Proyectos
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-700 transition"
              >
                Sobre Mí
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
