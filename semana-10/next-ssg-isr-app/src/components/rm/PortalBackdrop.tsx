// Decoración del hero: un portal verde-cian que gira despacio y un borde con gotas de baba.
// Es arte propio hecho con SVG; no contiene texto ni es contenido, por eso va oculto a los lectores de pantalla.

export function Portal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ filter: "drop-shadow(0 0 22px rgba(151,206,76,.55)) drop-shadow(0 0 60px rgba(56,230,224,.35))" }}
    >
      <defs>
        <radialGradient id="portal-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#02070b" />
          <stop offset="55%" stopColor="#0b3a2a" />
          <stop offset="82%" stopColor="#97ce4c" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#38e6e0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="290" fill="url(#portal-core)" />
      <g className="k-portal-spin" fill="none" strokeLinecap="round">
        <path d="M300 40 C 470 60 560 200 540 320 C 520 450 380 560 250 540" stroke="#d8ffb0" strokeWidth="7" opacity="0.9" />
        <path d="M300 90 C 430 100 500 210 485 310 C 465 410 360 490 255 478" stroke="#97ce4c" strokeWidth="9" opacity="0.85" />
        <path d="M300 140 C 390 150 440 220 430 300 C 418 370 345 425 265 418" stroke="#38e6e0" strokeWidth="8" opacity="0.8" />
        <path d="M300 190 C 355 198 385 240 380 295 C 372 340 330 368 280 362" stroke="#ffffff" strokeWidth="5" opacity="0.7" />
        <path d="M300 235 C 328 240 342 262 338 290 C 333 312 315 324 296 321" stroke="#d8ffb0" strokeWidth="4" opacity="0.8" />
      </g>
    </svg>
  );
}

// Línea inferior con gotas (solo el trazo, sin relleno): se pega al final de una sección con position: relative.
export function Drips({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 70"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M0 14 C14 14 20 14 40 14 C90 14 94 46 120 46 C146 46 150 14 200 14 C252 14 256 30 276 30 C296 30 300 14 350 14 C402 14 406 60 436 60 C466 60 470 14 520 14 C574 14 578 36 600 36 C622 36 626 14 676 14 C730 14 734 48 760 48 C786 48 790 14 840 14 C896 14 900 26 918 26 C936 26 940 14 990 14 C1044 14 1048 58 1076 58 C1104 58 1110 14 1160 14 C1212 14 1216 32 1236 32 C1256 32 1260 14 1300 14 C1340 14 1344 52 1370 52 C1396 52 1400 14 1440 14"
        fill="none"
        stroke="#97ce4c"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
