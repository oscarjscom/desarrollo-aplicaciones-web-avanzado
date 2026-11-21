import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types';
import { ArrowUpRight } from './Icons';

interface ProjectCardProps {
  project: Project;
  index: number;
  wide?: boolean;
  className?: string;
}

export default function ProjectCard({
  project,
  index,
  wide = false,
  className = '',
}: ProjectCardProps) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group flex overflow-hidden rounded-3xl border border-line bg-surface transition duration-500 hover:-translate-y-1 hover:border-accent/40 ${
        wide ? 'flex-col md:flex-row' : 'flex-col'
      } ${className}`}
    >
      <div
        className={`relative overflow-hidden ${
          wide ? 'aspect-[16/10] md:aspect-auto md:min-h-72 md:w-3/5' : 'aspect-[16/10]'
        }`}
      >
        {/* Imágenes con lazy loading y tamaños responsivos */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes={
            wide
              ? '(max-width: 768px) 100vw, 640px'
              : '(max-width: 1024px) 100vw, 640px'
          }
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface/70 via-transparent to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-bg/70 px-3 py-1 font-mono text-xs text-fg backdrop-blur">
          {number}
        </span>
      </div>

      <div className={`flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8 ${wide ? 'md:w-2/5' : ''}`}>
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
              {project.title}
            </h3>
            <ArrowUpRight className="mt-1 size-5 shrink-0 text-mute transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </div>
          <p className="mt-3 line-clamp-3 max-w-[48ch] leading-relaxed text-mute">
            {project.description}
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg/80"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
