// Marquesina infinita: la pista lleva el contenido dos veces y se desplaza la mitad (ver globals.css).
// Sin degradados en los bordes y sin pausa al pasar el cursor: el movimiento es constante.

interface MarqueeProps {
  items: string[];
  label: string; // lo que lee un lector de pantalla, ya que el movimiento es decorativo
  speed?: number; // segundos por vuelta: menos = más rápido
  className?: string;
}

export default function Marquee({ items, label, speed = 30, className = "" }: MarqueeProps) {
  const row = (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center whitespace-nowrap">
          <span className="px-6 md:px-10">{item}</span>
          <span>●</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <p className="sr-only">
        {label}: {items.join(", ")}
      </p>
      <div
        className="k-marquee-track flex w-max"
        style={{ animationDuration: `${speed}s`, animationDirection: "reverse" }}
        aria-hidden="true"
      >
        {row}
        {row}
      </div>
    </div>
  );
}
