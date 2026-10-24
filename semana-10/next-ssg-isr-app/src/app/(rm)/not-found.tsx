import Link from "next/link";

// NotFound Handler: se muestra cuando se llama a notFound(), por ejemplo en /character/99999.
export default function RickMortyNotFound() {
  return (
    <div className="mx-auto max-w-[95vw] py-16">
      <div className="border-2 border-k-border p-6 md:p-10">
        <p className="text-[clamp(3rem,10vw,8rem)] font-bold uppercase leading-[0.8] tracking-tighter text-k-muted">
          404
        </p>
        <p className="mt-4 text-3xl font-bold uppercase leading-none tracking-tighter md:text-5xl">
          Personaje no encontrado
        </p>
        <p className="mt-4 max-w-xl text-lg text-k-muted-fg">
          Ese personaje no existe en este universo. Prueba con otro o vuelve al catálogo.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-14 items-center bg-k-accent px-8 text-sm font-bold uppercase tracking-tighter text-black transition-transform hover:scale-105 active:scale-95"
        >
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
