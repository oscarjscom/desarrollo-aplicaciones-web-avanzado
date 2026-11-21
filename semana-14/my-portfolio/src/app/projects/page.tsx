import { Metadata } from 'next';
import { projects } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Explora mi colección de proyectos de desarrollo web y aplicaciones',
  openGraph: {
    title: 'Proyectos - Portafolio',
    description: 'Explora mi colección de proyectos de desarrollo web',
    images: ['/og-projects.jpg'],
  },
};

// Patrón de la grilla: 7/5, 5/7 y una pieza ancha al final
const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7', 'lg:col-span-12'];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
      <header className="mb-14 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="rise font-mono text-xs uppercase tracking-widest text-accent">
            Archivo · {String(projects.length).padStart(2, '0')} proyectos
          </p>
          <h1
            className="rise mt-4 text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-6xl"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            Mis proyectos
          </h1>
        </div>
        <p
          className="rise max-w-[46ch] text-lg leading-relaxed text-mute"
          style={{ '--i': 2 } as React.CSSProperties}
        >
          Una colección de proyectos en los que he trabajado durante el curso, desde el
          renderizado en servidor hasta la autenticación y la base de datos.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            wide={i === projects.length - 1}
            className={spans[i % spans.length]}
          />
        ))}
      </div>
    </div>
  );
}
