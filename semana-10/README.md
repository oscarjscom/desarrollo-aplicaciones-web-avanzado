<div align="center">

# Semana 10 — Enrutamiento y Páginas
**Laboratorio 10 · Pokédex con App Router (SSG e ISR) · Tarea: Rick and Morty con rutas estáticas y dinámicas**

[Volver al inicio](../README.md)

</div>

---

## Contenido
| Proyecto | Tipo | Descripción |
|---|---|---|
| [`next-ssg-isr-app`](next-ssg-isr-app) | Laboratorio y tarea | Pokédex (`/pokemon`) con SSG, ISR y manejo de errores; y catálogo de Rick and Morty (`/`) con búsqueda en tiempo real y 826 fichas estáticas |

Stack: **Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS · react-icons · simplex-noise · motion · ESLint**.

---

## Laboratorio

### Preparación
| Paso | Captura |
|---|---|
| Node superior a 18.18 | <img src="capturas/01_terminal_node.png" width="320"> |
| Crear el proyecto `next-ssg-isr-app` | <img src="capturas/02_terminal_create_next_app.png" width="320"> |
| Instalar `react-icons` | <img src="capturas/03_terminal_react_icons.png" width="320"> |
| Estructura del proyecto | <img src="capturas/04_estructura_proyecto.png" width="320"> |
| `npm run dev` | <img src="capturas/05_terminal_npm_run_dev.png" width="320"> |

### Ejercicio 1 · Pokédex con App Router (ISR)
| Archivo | Qué hace |
|---|---|
| `src/types/pokemon.ts` | Tipado de las respuestas de la PokeAPI |
| `src/app/pokemon/layout.tsx` | Layout con navegación; usa `Link` en vez de `<a>` para no recargar la página |
| `src/app/pokemon/page.tsx` | Lista de 151 Pokémon, con `revalidate: 86400` (ISR, cada 24 horas) y carga de imágenes bajo demanda |
| `src/app/pokemon/[name]/page.tsx` | Detalle: `generateStaticParams` (SSG) para los 151 Pokémon, `generateMetadata` y `revalidate` |
| `src/app/pokemon/error.tsx` | Error Handler: se muestra si algo falla al cargar los datos |
| `src/app/pokemon/not-found.tsx` | NotFound Handler: se muestra cuando el Pokémon no existe |
| `next.config.ts` | Permite las imágenes de `raw.githubusercontent.com` |

<table><tr>
<td align="center"><img src="capturas/06_pokemon_lista_isr.jpg" width="440"><br><sub>Ruta <code>/pokemon</code> (ISR)</sub></td>
<td align="center"><img src="capturas/09_pokemon_detalle_ssg.jpg" width="440"><br><sub>Ruta <code>/pokemon/pikachu</code> (SSG)</sub></td>
</tr><tr>
<td align="center"><img src="capturas/07_error_handler.jpg" width="440"><br><sub>Error Handler (<code>error.tsx</code>)</sub></td>
<td align="center"><img src="capturas/08_not_found.jpg" width="440"><br><sub>NotFound Handler (<code>not-found.tsx</code>)</sub></td>
</tr></table>

**Carga bajo demanda (lazy loading).** En el Network de DevTools, con el filtro **Img**, las imágenes de los Pokémon no se piden todas al abrir la página: van apareciendo mientras se baja con el scroll (en la captura, 147 de 174 peticiones tras recorrer la lista). Los archivos `.svg` se piden directo a `raw.githubusercontent.com`, porque Next.js no optimiza los SVG.

<table><tr>
<td align="center"><img src="capturas/12_devtools_network_lazy_loading.jpg" width="640"><br><sub>Network con el filtro Img: las imágenes se cargan a medida que se hace scroll</sub></td>
</tr></table>

Para mostrar el error se cambió la URL de la lista por una inexistente solo durante la captura, y se volvió a la original. Para el not-found se abrió `/pokemon/pokemon-que-no-existe`: la API responde 404 y la página llama a `notFound()`.

### Build de producción
```bash
npm run build
npm start
```
<table><tr>
<td align="center"><img src="capturas/10_terminal_npm_run_build.png" width="440"><br><sub><code>npm run build</code></sub></td>
<td align="center"><img src="capturas/11_terminal_npm_start.png" width="440"><br><sub><code>npm start</code></sub></td>
</tr></table>

---

## Tarea · Rick and Morty (rutas estáticas y dinámicas)
### Capturas
**Póster de entrada.** Es lo primero que se ve; al pulsar "Entrar al catálogo" lleva al panel de búsqueda.
<table><tr>
<td align="center"><img src="capturas/14_tarea_poster_animacion.jpg" width="440"><br><sub>El póster entra por capas</sub></td>
<td align="center"><img src="capturas/15_tarea_poster_entrada.jpg" width="440"><br><sub>Póster completo con el botón "Entrar al catálogo"</sub></td>
</tr></table>

**Búsqueda (CSR) y lista (SSR).**
<table><tr>
<td align="center"><img src="capturas/16_tarea_inicio_busqueda.jpg" width="440"><br><sub>Al entrar: panel de búsqueda arriba y lista de personajes</sub></td>
<td align="center"><img src="capturas/17_tarea_personajes_ssr.jpg" width="440"><br><sub>Lista de personajes (SSR + caché)</sub></td>
</tr><tr>
<td align="center"><img src="capturas/18_tarea_busqueda_nombre.jpg" width="440"><br><sub>Búsqueda por nombre en tiempo real</sub></td>
<td align="center"><img src="capturas/19_tarea_filtros_combinados.jpg" width="440"><br><sub>Filtros combinados: nombre, estado y género</sub></td>
</tr><tr>
<td align="center"><img src="capturas/20_tarea_validacion_cliente.jpg" width="440"><br><sub>Validación en el cliente</sub></td>
<td align="center"><img src="capturas/21_tarea_sin_resultados.jpg" width="440"><br><sub>Búsqueda sin resultados</sub></td>
</tr></table>

**Detalle de cada personaje (SSG + ISR).**
<table><tr>
<td align="center"><img src="capturas/22_tarea_detalle_personaje.jpg" width="440"><br><sub><code>/character/1</code>: ficha del personaje</sub></td>
<td align="center"><img src="capturas/23_tarea_detalle_campos_response.jpg" width="440"><br><sub>Todos los campos del Response</sub></td>
</tr><tr>
<td align="center"><img src="capturas/24_tarea_personaje_no_encontrado.jpg" width="440"><br><sub>Personaje que no existe (NotFound)</sub></td>
<td align="center"><img src="capturas/25_tarea_movil_poster.jpg" width="130"> <img src="capturas/26_tarea_movil_inicio.jpg" width="130"> <img src="capturas/27_tarea_movil_detalle.jpg" width="130"><br><sub>Vista móvil</sub></td>
</tr></table>

**Build de producción.** Genera 983 páginas estáticas; las 826 fichas aparecen con `Revalidate 10d`.
<table><tr>
<td align="center"><img src="capturas/13_tarea_terminal_build.png" width="520"><br><sub><code>npm run build</code></sub></td>
</tr></table>

**Network de DevTools (carga bajo demanda y búsqueda).** Con el filtro Img, antes de bajar hay hasta `16.jpeg`; al recorrer la lista aparecen `17` a `20`. Con el filtro Fetch/XHR se ve la búsqueda como una petición propia.
<table><tr>
<td align="center"><img src="capturas/28_tarea_devtools_lazy_antes_img.jpg" width="300"><br><sub>Img: antes de hacer scroll</sub></td>
<td align="center"><img src="capturas/29_tarea_devtools_lazy_despues_img.jpg" width="300"><br><sub>Img: después de recorrer la lista</sub></td>
<td align="center"><img src="capturas/31_tarea_devtools_busqueda_fetch_xhr.jpg" width="300"><br><sub>Fetch/XHR: la búsqueda (<code>characters?page=…</code>)</sub></td>
</tr></table>

---

## Cómo ejecutarlo
```bash
cd semana-10/next-ssg-isr-app
npm install
npm run dev            # http://localhost:3000 (catálogo) y /pokemon (Pokédex)
# producción
npm run build
npm start
```

---
