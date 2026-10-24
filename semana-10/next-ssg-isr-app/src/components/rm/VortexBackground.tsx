"use client";

import { Vortex } from "@/components/ui/vortex";

// Fondo animado de toda la página: remolino de partículas en tonos verde-lima, como el portal.
// Va fijo detrás del contenido, no recibe clics y es solo decoración (por eso está oculto a los lectores de pantalla).
// Menos partículas que el valor por defecto y opacidad baja: se nota, pero no estorba al leer.
export default function VortexBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-45">
      <Vortex
        backgroundColor="transparent"
        baseHue={68} // 68 = amarillo verdoso; con rangeHue 55 llega hasta 123 = verde
        rangeHue={55}
        particleCount={320}
        rangeY={240}
        baseSpeed={0.05}
        rangeSpeed={1.3}
        baseRadius={1}
        rangeRadius={2}
        containerClassName="h-full w-full"
        className="hidden"
      />
    </div>
  );
}
