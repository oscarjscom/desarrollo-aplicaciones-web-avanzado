import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';
import { ArrowLeft, ArrowRight, ArrowUpRight, GithubMark } from '@/components/Icons';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Proyecto no encontrado',
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];

  if (!project) {
    notFound();
  }

  const next = projects[(index + 1) % projects.length];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:py-16">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-mute transition hover:text-fg"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Volver a proyectos
      </Link>

      <article className="mt-10">
        <header className="rise max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Proyecto {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
        </header>

        <div
          className="rise relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-line bg-surface"
          style={{ '--i': 2 } as React.CSSProperties}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-mute">Resumen</h2>
            <p className="mt-4 max-w-[58ch] text-xl leading-relaxed tracking-tight">
              {project.description}.
            </p>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-mute">
                Tecnologías utilizadas
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-fg/90"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition duration-300 hover:-translate-y-px active:scale-[0.98]"
                >
                  Ver demo
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium transition duration-300 hover:border-fg/40 active:scale-[0.98]"
                >
                  <GithubMark className="size-4" />
                  Ver código
                </a>
              )}
            </div>
          </div>
        </div>
      </article>

      <Link
        href={`/projects/${next.slug}`}
        className="group mt-20 flex items-center justify-between gap-6 border-t border-line pt-8"
      >
        <span>
          <span className="font-mono text-xs uppercase tracking-widest text-mute">Siguiente</span>
          <span className="mt-2 block text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
            {next.title}
          </span>
        </span>
        <ArrowRight className="size-8 shrink-0 text-mute transition duration-300 group-hover:translate-x-2 group-hover:text-accent" />
      </Link>
    </div>
  );
}
