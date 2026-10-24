"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Imagen del personaje con carga bajo demanda (lazy loading) y recuperación de errores.
// El servidor de avatares de la API responde 429 si llegan muchas peticiones seguidas desde la misma IP;
// en ese caso se reintenta con pausas crecientes y, si sigue fallando, se muestra el nombre en su lugar.

const RETRY_DELAYS_MS = [1500, 4000, 9000];

type Status = "ok" | "retrying" | "failed";

interface CharacterImageProps {
  src: string;
  name: string;
  priority?: boolean;
}

export default function CharacterImage({ src, name, priority = false }: CharacterImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const attempts = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const [status, setStatus] = useState<Status>("ok");

  // Programa el siguiente intento: cambia el src de la propia imagen (con ?intento=n para saltarse una respuesta fallida)
  const retry = useCallback(() => {
    window.clearTimeout(timer.current);
    const n = attempts.current;
    if (n >= RETRY_DELAYS_MS.length) {
      setStatus("failed");
      return;
    }
    setStatus("retrying");
    timer.current = window.setTimeout(() => {
      attempts.current = n + 1;
      if (imgRef.current) imgRef.current.src = `${src}?intento=${n + 1}`;
    }, RETRY_DELAYS_MS[n]);
  }, [src]);

  // Si la imagen falló antes de que React estuviera listo (viene en el HTML del servidor), el evento
  // de error ya pasó y nadie lo escuchó: se comprueba una vez al montar.
  useEffect(() => {
    const el = imgRef.current;
    const check = el && el.complete && el.naturalWidth === 0 ? window.setTimeout(retry, 0) : undefined;
    return () => {
      window.clearTimeout(check);
      window.clearTimeout(timer.current);
    };
  }, [retry]);

  if (status === "failed") {
    return (
      <div className="flex h-full w-full items-center justify-center p-3 text-center text-xl font-bold uppercase leading-none tracking-tighter text-k-muted-fg group-hover:text-black md:text-2xl">
        {name}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={`Imagen de ${name}`}
      width={300}
      height={300}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      draggable={false}
      onLoad={() => setStatus("ok")}
      onError={retry}
      className={`h-full w-full object-cover ${status === "retrying" ? "invisible" : ""}`}
    />
  );
}
