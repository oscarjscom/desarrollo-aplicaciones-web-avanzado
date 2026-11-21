import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { personalInfo } from '@/lib/data';
import { ArrowUpRight, GithubMark } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Contacto',
  description: `Escríbeme un mensaje: ${personalInfo.name}, ${personalInfo.title}`,
  openGraph: {
    title: 'Contacto - Portafolio',
    description: `Escríbeme un mensaje: ${personalInfo.name}`,
    images: ['/og-image.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-20">
      <div>
        <p className="rise font-mono text-xs uppercase tracking-widest text-accent">Contacto</p>
        <h1
          className="rise mt-4 text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl"
          style={{ '--i': 1 } as React.CSSProperties}
        >
          Hablemos de tu próximo proyecto
        </h1>
        <p
          className="rise mt-6 max-w-[44ch] text-lg leading-relaxed text-mute"
          style={{ '--i': 2 } as React.CSSProperties}
        >
          ¿Tienes una idea o un proyecto? Escríbeme un mensaje y te responderé lo antes posible.
          También puedes revisar mi código en GitHub.
        </p>

        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rise group mt-10 flex max-w-sm items-center justify-between rounded-2xl border border-line bg-surface p-5 transition duration-300 hover:border-accent/40"
          style={{ '--i': 3 } as React.CSSProperties}
        >
          <span className="flex items-center gap-3">
            <GithubMark className="size-6" />
            <span>
              <span className="block text-sm font-medium">GitHub</span>
              <span className="block font-mono text-xs text-mute">oscarjscom</span>
            </span>
          </span>
          <ArrowUpRight className="size-5 text-mute transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </a>
      </div>

      <div
        className="rise rounded-3xl border border-line bg-surface p-6 sm:p-8"
        style={{ '--i': 2 } as React.CSSProperties}
      >
        <ContactForm />
      </div>
    </div>
  );
}
