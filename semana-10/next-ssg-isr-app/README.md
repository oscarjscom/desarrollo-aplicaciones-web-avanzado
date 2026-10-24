# Next.js · SSG e ISR (Pokédex y Rick and Morty)

Laboratorio y tarea de la semana 10: rutas estáticas y dinámicas con el App Router, revalidación de datos y manejo de errores.

## Rutas
| Ruta | Archivo | Técnica |
|---|---|---|
| `/` | `src/app/(rm)/page.tsx` | Lista de Rick and Morty: SSR con caché forzada + ISR cada 10 días; búsqueda en CSR |
| `/character/[id]` | `src/app/(rm)/character/[id]/page.tsx` | SSG con `generateStaticParams` (826 personajes) + ISR cada 10 días |
| `/api/characters` | `src/app/api/characters/route.ts` | Busca por name, status, type y gender, validando en el servidor |
| `/pokemon` | `src/app/pokemon/page.tsx` | Pokédex: ISR (`revalidate: 86400`) |
| `/pokemon/[name]` | `src/app/pokemon/[name]/page.tsx` | SSG con `generateStaticParams` (151 Pokémon) + ISR |

Datos de [Rick and Morty API](https://rickandmortyapi.com) y [PokeAPI](https://pokeapi.co). No hace falta ninguna clave.

## Ejecutar
```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm start
```
