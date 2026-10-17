<div align="center">

# Semana 09 — Introducción a Next.js
**Laboratorio 09 · CSR contra SSR con PokeAPI y Open-Meteo · Tarea: Galería de Películas y Series con OMDb**

[Volver al inicio](../README.md)

</div>

---

## Contenido
| Proyecto | Tipo | Descripción |
|---|---|---|
| [`my-first-project`](my-first-project) | Laboratorio | PokeApp (CSR contra SSR) y dashboard del clima híbrido |
| [`galeria-peliculas`](galeria-peliculas) | Tarea | CINE/KINETIC: galería con portada en SSR, búsqueda en CSR y detalle en ventana modal |

Stack: **Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS · axios · ESLint**.

---

## Laboratorio

### Preparación
| Paso | Captura |
|---|---|
| Node superior a 18.18 | <img src="capturas/01_terminal_node.png" width="320"> |
| Crear el proyecto con `create-next-app` | <img src="capturas/02_terminal_create_next_app.png" width="320"> |
| Instalar `axios` | <img src="capturas/03_terminal_axios.png" width="320"> |
| Estructura del proyecto | <img src="capturas/04_estructura_proyecto.png" width="320"> |
| `npm run dev` | <img src="capturas/05_terminal_npm_run_dev.png" width="320"> |

La versión actual de Next.js activa por defecto `cacheComponents` y `partialPrefetching`. Para que el SSR clásico del laboratorio funcione, se desactivaron en `next.config.ts`.

### Ejercicio 1.1 · PokeApp: CSR contra SSR
| Página | Qué hace |
|---|---|
| `app/pokemon-csr/page.tsx` | `'use client'`, `useState` y `useEffect`: pide el Pokémon desde el navegador |
| `app/pokemon-ssr/page.tsx` | Componente `async`: pide el Pokémon en el servidor |

<table><tr>
<td align="center"><img src="capturas/07_pokemon_csr_cargando.jpg" width="300"><br><sub>CSR: pantalla "Cargando…"</sub></td>
<td align="center"><img src="capturas/08_pokemon_csr.jpg" width="300"><br><sub>CSR con el Pokémon</sub></td>
<td align="center"><img src="capturas/09_pokemon_ssr.jpg" width="300"><br><sub>SSR</sub></td>
</tr></table>

**Código fuente (Ctrl + U):** el SSR ya trae el Pokémon dentro del HTML; el CSR solo trae "Cargando…".
<table><tr>
<td align="center"><img src="capturas/10_codigo_fuente_csr.jpg" width="440"><br><sub>CSR</sub></td>
<td align="center"><img src="capturas/11_codigo_fuente_ssr.jpg" width="440"><br><sub>SSR</sub></td>
</tr></table>

**Network de DevTools**
<table><tr>
<td align="center"><img src="capturas/13_devtools_network_csr_fetch_xhr.jpg" width="440"><br><sub>CSR, filtro Fetch/XHR: 2 de 26 peticiones</sub></td>
<td align="center"><img src="capturas/15_devtools_network_ssr_fetch_xhr.jpg" width="440"><br><sub>SSR, filtro Fetch/XHR: 0 de 22 peticiones</sub></td>
</tr></table>

| | CSR | SSR |
|---|---|---|
| ¿El HTML inicial trae el Pokémon? | No | Sí |
| ¿Cuándo aparece el contenido? | Después del JavaScript y de la petición (~650 ms) | Con el primer HTML |
| Peticiones del navegador a la PokeAPI | 2 (en desarrollo, React ejecuta `useEffect` dos veces; en producción sería 1) | 0 |
| Quién pide los datos | El navegador | El servidor de Next.js |

### Ejercicio 2.1 · Dashboard del clima híbrido
`app/weather/page.tsx` (Lima, **SSR**) y `app/weather/ClientWeatherWidget.tsx` (selector de ciudad, **CSR**).

<table><tr>
<td align="center"><img src="capturas/16_clima_dashboard.jpg" width="300"><br><sub>Dashboard</sub></td>
<td align="center"><img src="capturas/17_clima_cambio_ciudad.jpg" width="300"><br><sub>Cambio de ciudad sin recargar</sub></td>
<td align="center"><img src="capturas/18_clima_codigo_fuente.jpg" width="300"><br><sub>Lima (SSR) ya viene en el HTML</sub></td>
</tr></table>
<table><tr>
<td align="center"><img src="capturas/20_devtools_network_clima_fetch_xhr.jpg" width="640"><br><sub>Network: al cambiar de ciudad aparece una petición nueva, sin recargar</sub></td>
</tr></table>

---

## Tarea · Galería de Películas y Series (CINE/KINETIC)
API de [OMDb](https://www.omdbapi.com). Código en [`galeria-peliculas`](galeria-peliculas); su [README](galeria-peliculas/README.md) explica la estructura y el diseño.

**Aplicación en línea (Vercel):** <https://galeria-peliculas-three.vercel.app>

| Requisito | Cómo se cumple |
|---|---|
| Página principal en **SSR** | `app/page.tsx` es una página `async` con `force-dynamic`: 12 títulos populares traídos en el servidor |
| Búsqueda en **CSR** | `components/SearchGallery.tsx`: campo con resultados en tiempo real, filtros por tipo y paginación, sin recargar |
| Detalle | Ventana modal (`components/MovieModal.tsx`) con la información completa |
| `'use client'` | Solo en los componentes con estado o eventos: `SearchGallery`, `MovieModal`, `PopularGrid` |
| `async/await` | Página SSR, cliente de OMDb, ruta `/api/movies` y las peticiones del navegador |
| `useState` y `useEffect` | Búsqueda con debounce de 400 ms, carga del detalle, cierre con Escape y bloqueo del fondo |
| UI con Tailwind | Estilo *Kinetic Typography*: tokens en `globals.css`, marquesinas, números enormes, inversión de color al pasar el cursor |

### Capturas en el navegador
<table><tr>
<td align="center"><img src="capturas/21_galeria_inicio.jpg" width="440"><br><sub>Portada</sub></td>
<td align="center"><img src="capturas/22_galeria_populares_ssr.jpg" width="440"><br><sub>Populares (SSR)</sub></td>
</tr><tr>
<td align="center"><img src="capturas/23_galeria_detalle_modal.jpg" width="440"><br><sub>Detalle en ventana modal</sub></td>
<td align="center"><img src="capturas/25_galeria_busqueda_csr.jpg" width="440"><br><sub>Búsqueda en tiempo real (CSR)</sub></td>
</tr><tr>
<td align="center"><img src="capturas/26_galeria_filtro_series.jpg" width="440"><br><sub>Filtro por Series</sub></td>
<td align="center"><img src="capturas/27_galeria_detalle_busqueda.jpg" width="440"><br><sub>Detalle de un resultado</sub></td>
</tr><tr>
<td align="center"><img src="capturas/24_galeria_validacion_cliente.jpg" width="440"><br><sub>Validación en el cliente</sub></td>
<td align="center"><img src="capturas/28_galeria_sin_resultados.jpg" width="440"><br><sub>Sin resultados</sub></td>
</tr><tr>
<td align="center"><img src="capturas/29_galeria_por_que_csr_ssr.jpg" width="440"><br><sub>Justificación de CSR y SSR</sub></td>
<td align="center"><img src="capturas/31_galeria_movil_populares.jpg" width="200"><br><sub>Vista móvil</sub></td>
</tr></table>

### Network de DevTools
<table><tr>
<td align="center"><img src="capturas/33_galeria_devtools_network_ssr_fetch_xhr.jpg" width="440"><br><sub>Portada, filtro Fetch/XHR: 0 peticiones de datos (los trajo el servidor)</sub></td>
<td align="center"><img src="capturas/35_galeria_devtools_network_busqueda_fetch_xhr.jpg" width="440"><br><sub>Búsqueda, filtro Fetch/XHR: petición a <code>/api/movies</code> desde <code>SearchGallery</code></sub></td>
</tr></table>

### Por qué SSR o CSR en cada caso
- **Portada, SSR.** Los populares son los mismos para todos. El servidor los trae y entrega el HTML completo: aparece al instante, sin pantalla de carga, los buscadores lo leen (SEO) y la clave de OMDb no llega al navegador.
- **Búsqueda, CSR.** Lo que se pide depende de lo que escribe el usuario, y eso solo lo sabe el navegador. Los resultados cambian sin recargar la página, con `useState` y `useEffect`.
- **Detalle, CSR.** La ventana modal responde a clics y al teclado, eventos que solo existen en el cliente.

### Validación en el cliente y en el servidor
Las mismas reglas (`lib/validation.ts`) se aplican en el navegador (mínimo 3 letras, máximo 60, solo caracteres simples) y en `/api/movies`, que vuelve a validar la búsqueda, la página, el tipo y el identificador de IMDb, y responde 400 con el detalle del error. La clave de OMDb se guarda en `.env.local` y nunca se sube a Git.

---

## Cómo ejecutarlo
```bash
# Laboratorio
cd semana-09/my-first-project
npm install
npm run dev            # /pokemon-csr  /pokemon-ssr  /weather

# Tarea
cd semana-09/galeria-peliculas
npm install
cp .env.example .env.local     # escribir la clave de OMDb
npm run dev
```

## Conclusiones
1. Aprendí que Next.js permite elegir cómo se renderiza cada parte de una aplicación: en el servidor (SSR) o en el navegador (CSR).
2. Entendí que el SSR sirve cuando el contenido es el mismo para todos y conviene que llegue ya listo, como la portada, y que el CSR sirve cuando el contenido cambia con lo que hace el usuario, como la búsqueda.
3. Practiqué `'use client'`, `useState` y `useEffect`, y comprobé en el Network de DevTools que el CSR hace peticiones desde el navegador y el SSR no.
4. Resolví problemas reales: la versión nueva de Next.js trae opciones activadas por defecto que rompían el SSR, y la clave de la API debía quedarse en el servidor, así que la búsqueda pasa por una ruta propia.
5. Con Tailwind y una guía de diseño armé una interfaz con identidad propia, y vi que validar tanto en el cliente como en el servidor hace la aplicación más segura.
