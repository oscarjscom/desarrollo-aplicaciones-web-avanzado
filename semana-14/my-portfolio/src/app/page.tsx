import Image from 'next/image';
import Link from 'next/link';
import { projects, personalInfo } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';
import TechMarquee from '@/components/TechMarquee';
import { ArrowRight, GithubMark } from '@/components/Icons';

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured);
  const withDemo = projects.filter((p) => p.demoUrl).length;

  const stats = [
    { value: String(projects.length).padStart(2, '0'), label: 'proyectos en GitHub' },
    { value: String(withDemo).padStart(2, '0'), label: 'publicados en Vercel' },
    { value: '14', label: 'semanas de laboratorios' },
  ];

  return (
    <>
      {/* Hero asimétrico: texto a la izquierda, identidad a la derecha */}
      <section className="mx-auto grid min-h-[min(46rem,calc(100dvh-5rem))] max-w-6xl items-center gap-14 px-5 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:py-20">
        <div>
          <p
            className="rise inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-mute"
            style={{ '--i': 0 } as React.CSSProperties}
          >
            <span className="dot-live size-1.5 rounded-full bg-accent" />
            Estudiante de Tecsup
          </p>

          <h1
            className="rise mt-7 text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl lg:text-6xl"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            {personalInfo.name}
            <span className="mt-3 block text-2xl font-normal tracking-tight text-accent sm:text-3xl">
              {personalInfo.title}
            </span>
          </h1>

          <p
            className="rise mt-7 max-w-[52ch] text-lg leading-relaxed text-mute"
            style={{ '--i': 2 } as React.CSSProperties}
          >
            {personalInfo.description}.
          </p>

          <div
            className="rise mt-10 flex flex-wrap items-center gap-3"
            style={{ '--i': 3 } as React.CSSProperties}
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition duration-300 hover:-translate-y-px active:scale-[0.98]"
            >
              Ver proyectos
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium transition duration-300 hover:border-fg/40 active:scale-[0.98]"
            >
              <GithubMark className="size-4" />
              GitHub
            </a>
          </div>
        </div>

        <div
          className="rise relative mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end"
          style={{ '--i': 2 } as React.CSSProperties}
        >
          <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] border border-line bg-surface">
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.name}
              fill
              priority
              className="object-cover grayscale-[0.25] contrast-105"
              sizes="(max-width: 1024px) 384px, 340px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-bg/60 via-transparent to-transparent" />
          </div>

          <div className="glass absolute -bottom-6 -left-4 w-[88%] rounded-2xl p-4 font-mono text-[13px] leading-6 sm:-left-10">
            <p className="text-mute">
              <span className="text-accent">const</span> oscar = {'{'}
            </p>
            <p className="pl-4 text-fg/90">
              rol: <span className="text-accent">&apos;Full Stack&apos;</span>,
            </p>
            <p className="pl-4 text-fg/90">
              stack: [<span className="text-accent">&apos;Next.js&apos;</span>,{' '}
              <span className="text-accent">&apos;Prisma&apos;</span>],
            </p>
            <p className="text-mute">{'}'}</p>
          </div>
        </div>
      </section>

      <TechMarquee />

      {/* Cifras reales del recorrido */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <dl className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse py-6 sm:px-8 sm:py-2 sm:first:pl-0">
              <dt className="mt-2 text-sm text-mute">{stat.label}</dt>
              <dd className="font-mono text-5xl font-medium tracking-tighter">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Proyectos destacados: grilla asimétrica */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Trabajo seleccionado
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tighter sm:text-4xl">
              Proyectos destacados
            </h2>
          </div>
          <Link
            href="/projects"
            className="group hidden items-center gap-2 text-sm text-mute transition hover:text-fg sm:inline-flex"
          >
            Ver todos
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {featuredProjects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              wide={i === 2}
              className={['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-12'][i]}
            />
          ))}
        </div>
      </section>
    </>
  );
}
