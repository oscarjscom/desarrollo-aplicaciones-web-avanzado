"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Portal } from "./PortalBackdrop";

// Póster de entrada: capas de personajes que llegan con zoom de cámara, una detrás de otra,
// y el título que se revela al final. Sale primero cada vez que se entra a la página (carga completa)
// y se puede saltar. Al entrar al catálogo lleva directo al panel de búsqueda.

const CATALOG_ID = "buscar";
const EXIT_MS = 700;

interface Layer {
  id: number; // id del personaje en la API
  left: number; // % del póster
  top: number;
  size: number;
  rotate: number; // grados
  from: number; // escala inicial (las capas más cercanas a la cámara parten más grandes)
  delay: number; // segundos
}

// De atrás hacia delante: las capas del frente llegan más tarde y desde más cerca
const LAYERS: Layer[] = [
  { id: 47, left: 1, top: 4, size: 25, rotate: -5, from: 1.5, delay: 0.46 }, // Birdperson
  { id: 118, left: 74, top: 3, size: 25, rotate: 4, from: 1.6, delay: 0.56 }, // Evil Morty
  { id: 242, left: 0, top: 68, size: 25, rotate: 3, from: 1.75, delay: 0.65 }, // Mr. Meeseeks
  { id: 5, left: 75, top: 68, size: 25, rotate: -4, from: 1.9, delay: 0.74 }, // Jerry
  { id: 4, left: 25, top: 74, size: 23, rotate: -2, from: 2.05, delay: 0.84 }, // Beth
  { id: 3, left: 52, top: 74, size: 23, rotate: 3, from: 2.2, delay: 0.93 }, // Summer
  { id: 1, left: 8, top: 20, size: 42, rotate: -3, from: 2.4, delay: 1.1 }, // Rick
  { id: 2, left: 52, top: 24, size: 38, rotate: 3, from: 2.6, delay: 1.25 }, // Morty
];

const STAGE = "min(96vmin, 100vw)";
const titleStyle: CSSProperties = {
  color: "#38e6e0",
  WebkitTextStroke: "0.012em #97ce4c",
  paintOrder: "stroke fill",
  textShadow: "0 0 .25em rgba(2,7,11,.9)",
};

const subscribeNothing = () => () => {};

// Vale true una vez que el póster se cerró en esta carga de la página. Al recargar o entrar de nuevo vuelve a false,
// pero al volver desde otra ruta de la aplicación (por ejemplo desde la ficha de un personaje) no se repite.
let playedThisLoad = false;

// ¿Hay que saltarse el póster? Sí si ya se vio en esta carga o si se prefiere menos movimiento.
// En el servidor siempre se muestra, así el póster es lo primero que llega en el HTML.
function shouldSkip() {
  return playedThisLoad || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Lleva al catálogo (panel de búsqueda), dejando espacio para la barra superior fija
function goToCatalog() {
  const target = document.getElementById(CATALOG_ID);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${CATALOG_ID}`);
}

// auto: lo decide shouldSkip · leaving: animación de salida · gone: cerrado
type Phase = "auto" | "leaving" | "gone";

export default function PosterIntro() {
  const skipAtStart = useSyncExternalStore(subscribeNothing, shouldSkip, () => false);
  const [phase, setPhase] = useState<Phase>("auto");
  const visible = phase === "leaving" || (phase === "auto" && !skipAtStart);
  const leaving = phase === "leaving";

  const close = useCallback(() => {
    playedThisLoad = true;
    setPhase("leaving");
    window.setTimeout(() => {
      setPhase("gone");
      goToCatalog();
    }, EXIT_MS);
  }, []);

  // Mientras está el póster: sin scroll de fondo y Escape lo cierra (también el botón o un clic en cualquier parte)
  useEffect(() => {
    if (!visible || leaving) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, leaving, close]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Póster de entrada de Rick and Morty"
      onClick={close}
      className={`fixed inset-0 z-[80] flex items-center justify-center overflow-hidden transition-opacity ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        transitionDuration: `${EXIT_MS}ms`,
        background:
          "radial-gradient(circle at 50% 30%, rgba(56,230,224,.28), transparent 60%), radial-gradient(circle at 20% 90%, rgba(151,206,76,.22), transparent 55%), #02070b",
      }}
    >
      {/* Póster cuadrado: el lado es el 96 % del lado menor de la pantalla */}
      <div className="k-poster-stage relative" style={{ width: STAGE, height: STAGE }} aria-hidden="true">
        <Portal className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-80" />

        {LAYERS.map((layer) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={layer.id}
            src={`https://rickandmortyapi.com/api/character/avatar/${layer.id}.jpeg`}
            alt=""
            width={300}
            height={300}
            draggable={false}
            className="k-poster-tile pointer-events-none absolute aspect-square select-none border-2 border-k-border object-cover"
            style={
              {
                left: `${layer.left}%`,
                top: `${layer.top}%`,
                width: `${layer.size}%`,
                "--d": `${layer.delay}s`,
                "--s0": layer.from,
                "--r": `${layer.rotate}deg`,
                boxShadow: "0 0 0 2px rgba(2,7,11,.9)",
              } as CSSProperties
            }
          />
        ))}

        {/* Título: se revela de arriba abajo y se enfoca, como el logotipo del póster original */}
        <div className="k-poster-title pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-bold uppercase leading-[0.8] tracking-tighter">
          <p style={{ ...titleStyle, fontSize: `calc(${STAGE} * 0.2)` }}>Rick</p>
          <p className="text-k-accent" style={{ fontSize: `calc(${STAGE} * 0.075)`, textShadow: "0 0 .4em #02070b, 0 0 .15em #02070b" }}>
            and
          </p>
          <p style={{ ...titleStyle, fontSize: `calc(${STAGE} * 0.2)` }}>Morty</p>
        </div>
      </div>

      <button
        type="button"
        autoFocus
        onClick={(event) => {
          event.stopPropagation();
          close();
        }}
        className="k-poster-late absolute bottom-5 left-1/2 z-10 h-14 -translate-x-1/2 bg-k-accent px-8 text-sm font-bold uppercase tracking-tighter text-black transition-transform hover:scale-105 active:scale-95"
      >
        Entrar al catálogo →
      </button>
    </div>
  );
}
