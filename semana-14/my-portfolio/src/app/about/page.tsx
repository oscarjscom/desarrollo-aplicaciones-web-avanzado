import { Metadata } from 'next';
import Image from 'next/image';
import { personalInfo } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Sobre Mí',
  description: `Conoce más sobre ${personalInfo.name}, ${personalInfo.title}`,
};

const skillGroups = [
  { title: 'Lenguajes', items: ['JavaScript', 'TypeScript'] },
  { title: 'Interfaz', items: ['React', 'Next.js', 'Tailwind CSS'] },
  { title: 'Servidor y datos', items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Prisma', 'Supabase'] },
  { title: 'Acceso y herramientas', items: ['NextAuth.js', 'OAuth', 'Git y GitHub', 'Vercel'] },
];

const path = [
  { week: 'S09', text: 'Renderizado en cliente y en servidor (CSR y SSR)' },
  { week: 'S10', text: 'Páginas estáticas e ISR' },
  { week: 'S11', text: 'Interfaces con shadcn/ui y formularios validados' },
  { week: 'S12', text: 'API Routes con Prisma y PostgreSQL' },
  { week: 'S13', text: 'Autenticación con NextAuth.js, bcrypt y OAuth' },
  { week: 'S14', text: 'Optimización, SEO y despliegue' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="rise lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border border-line bg-surface">
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.name}
              fill
              className="object-cover grayscale-[0.25] contrast-105"
              loading="lazy"
              sizes="(max-width: 1024px) 384px, 400px"
            />
          </div>
          <p className="mt-5 font-mono text-xs text-mute">
            {personalInfo.name} · {personalInfo.title}
          </p>
        </div>

        <div>
          <p className="rise font-mono text-xs uppercase tracking-widest text-accent">
            Sobre mí
          </p>
          <h1
            className="rise mt-4 text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            Hola, soy {personalInfo.name}
          </h1>

          <div
            className="rise mt-8 max-w-[60ch] space-y-5 text-lg leading-relaxed text-mute"
            style={{ '--i': 2 } as React.CSSProperties}
          >
            <p>
              Soy estudiante de Tecsup y me apasiona crear experiencias web modernas. En el
              curso de Desarrollo de Aplicaciones Web Avanzado he construido aplicaciones
              completas con Next.js, desde el diseño de la interfaz hasta la base de datos y el
              despliegue.
            </p>
            <p>
              Mi enfoque está en escribir código limpio y ordenado, validar los datos tanto en
              el navegador como en el servidor y cuidar el rendimiento y el posicionamiento en
              buscadores.
            </p>
            <p>
              Cuando no estoy programando, me gusta aprender nuevas tecnologías y mejorar mis
              proyectos publicados en GitHub.
            </p>
          </div>

          <section className="mt-16" aria-labelledby="skills-title">
            <h2 id="skills-title" className="text-2xl font-semibold tracking-tighter sm:text-3xl">
              Habilidades técnicas
            </h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {skillGroups.map((group) => (
                <div key={group.title} className="grid gap-3 py-5 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-mono text-xs uppercase tracking-widest text-mute sm:pt-1.5">
                    {group.title}
                  </dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-16" aria-labelledby="path-title">
            <h2 id="path-title" className="text-2xl font-semibold tracking-tighter sm:text-3xl">
              Ruta en el curso
            </h2>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {path.map((step) => (
                <li key={step.week} className="flex items-baseline gap-6 py-4">
                  <span className="w-10 shrink-0 font-mono text-sm text-accent">{step.week}</span>
                  <span className="text-fg/90">{step.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
