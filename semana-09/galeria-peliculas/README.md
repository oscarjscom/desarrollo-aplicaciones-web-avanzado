# CINE/KINETIC · Galería de Películas y Series

Actividad integradora de la semana 9 (Next.js): una galería con la API de [OMDb](https://www.omdbapi.com) que combina las dos estrategias de renderizado.

| Parte | Renderizado | Dónde está |
|---|---|---|
| Portada con películas y series populares | **SSR** (servidor) | `app/page.tsx` |
| Búsqueda en tiempo real | **CSR** (navegador) | `components/SearchGallery.tsx` |
| Detalle completo en ventana modal | **CSR** | `components/MovieModal.tsx` |

## Cómo ejecutarlo
```bash
npm install
cp .env.example .env.local      # y escribir tu clave de OMDb
npm run dev
```
La clave gratuita se pide en https://www.omdbapi.com/apikey.aspx (1000 peticiones por día). Va solo en `.env.local`, que no se sube a Git.

## Por qué SSR o CSR en cada caso
**Portada, SSR.** Los populares son los mismos para todos los visitantes. El servidor los trae de OMDb y entrega el HTML ya completo: aparece al instante, sin pantalla de carga, los buscadores lo pueden leer (SEO) y la clave de OMDb nunca llega al navegador.

**Búsqueda, CSR.** Lo que se pide depende de lo que escribe el usuario, y eso solo lo sabe el navegador. Con `useState` y `useEffect` los resultados cambian en tiempo real sin recargar la página. Un resultado de búsqueda tampoco tiene sentido para el SEO.

**Detalle, CSR.** La ventana modal responde a clics y al teclado (Escape, Tab), eventos que no existen en el servidor.

## Uso de `'use client'`
Solo lleva la directiva lo que necesita estado o eventos del navegador:

| Archivo | ¿`'use client'`? | Motivo |
|---|---|---|
| `app/page.tsx` | No | Es una página `async` que pide datos en el servidor |
| `components/SearchGallery.tsx` | Sí | `useState`, `useEffect`, escritura del usuario |
| `components/MovieModal.tsx` | Sí | `useState`, `useEffect`, teclado y foco |
| `components/PopularGrid.tsx` | Sí | Abrir y cerrar el detalle (estado) |
| `components/MovieCard.tsx`, `Marquee.tsx` | No | Solo dibujan HTML |

## Estructura
```
galeria-peliculas/
├── app/
│   ├── page.tsx              # portada SSR: hero, populares, búsqueda, justificación
│   ├── layout.tsx            # fuente Space Grotesk y metadatos
│   ├── globals.css           # tokens de diseño, marquesinas y textura
│   └── api/movies/route.ts   # el navegador llama aquí; el servidor llama a OMDb
├── components/               # SearchGallery, MovieModal, PopularGrid, MovieCard, Marquee
└── lib/
    ├── omdb.ts               # cliente de OMDb (solo servidor) con caché en memoria
    ├── validation.ts         # reglas compartidas por el navegador y el servidor
    └── types.ts
```

## Validación en el cliente y en el servidor
Las mismas reglas (`lib/validation.ts`) se aplican en los dos lados:
- **Navegador:** mientras se escribe, mínimo 3 letras, máximo 60 y solo caracteres simples; muestra el mensaje y no hace la petición si no es válido.
- **Servidor** (`/api/movies`): vuelve a validar la búsqueda, la página (1 a 100), el tipo (`movie` o `series`) y el identificador de IMDb (`tt` y números). Responde 400 con el detalle de cada error.

## Diseño
Estilo *Kinetic Typography*: negro `#09090B`, blanco hueso `#FAFAFA` y un único acento `#DFE104`; titulares con `clamp()` en mayúsculas, números enormes en gris como forma gráfica, dos marquesinas infinitas, bordes duros de 2 px sin esquinas redondeadas ni sombras, inversión de color al pasar el cursor y textura de ruido. Respeta `prefers-reduced-motion`.
