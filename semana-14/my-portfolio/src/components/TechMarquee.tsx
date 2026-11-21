const items = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Prisma',
  'PostgreSQL',
  'Supabase',
  'NextAuth.js',
  'Node.js',
  'Vercel',
  'Git',
];

export default function TechMarquee() {
  // La lista se duplica para que el bucle sea continuo; la copia queda oculta para lectores de pantalla
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center font-mono text-sm uppercase tracking-widest text-mute"
        >
          <span className="px-8">{item}</span>
          <span className="size-1 rounded-full bg-accent" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="marquee overflow-hidden border-y border-line py-5"
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
