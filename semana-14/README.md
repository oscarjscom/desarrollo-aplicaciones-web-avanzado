<div align="center">

# Semana 14 — Optimización y SEO
**Laboratorio 14 · Portafolio personal con SEO optimizado**

[Volver al inicio](../README.md)

</div>

---

## Contenido
| Proyecto | Tipo | Descripción |
|---|---|---|
| [`my-portfolio`](my-portfolio) | Laboratorio | Portafolio personal con meta tags dinámicos, Open Graph, imágenes optimizadas, `sitemap.xml` y `robots.txt` |

Stack: **Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · ESLint**.

---

## Laboratorio · Portafolio con SEO optimizado

El portafolio muestra proyectos reales de este curso (Portal, Biblioteca, autenticación con NextAuth, galería de películas y Pokédex), con su demo y su código en GitHub.

### Qué se implementó
| Parte | Qué se hizo | Archivos |
|---|---|---|
| **1. Meta tags dinámicos** | Título con plantilla (`%s \| Nombre`), descripción, palabras clave, autor, `robots`, Open Graph y Twitter Card en el layout; cada página y cada proyecto define su propio título, descripción e imagen con `generateMetadata` | `src/app/layout.tsx`, `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx` |
| **2. Componentes compartidos** | Encabezado con la navegación y pie de página | `src/components/Header.tsx`, `Footer.tsx` |
| **3. Imágenes optimizadas** | `next/image` con formatos AVIF y WebP, tamaños por dispositivo, dominios externos autorizados, `sizes` y carga diferida (`loading="lazy"`); `priority` en la imagen principal | `next.config.ts`, `src/components/ProjectCard.tsx`, `src/app/about/page.tsx` |
| **4. Sitemap dinámico** | Genera `sitemap.xml` con las páginas fijas y una entrada por cada proyecto | `src/app/sitemap.ts` |
| **5. robots.txt** | Permite indexar el sitio, bloquea `/api/`, `/admin/` y `/_next/`, y apunta al sitemap | `src/app/robots.ts` |
| **6. Verificación** | Etiquetas `<meta>` del `<head>` y auditoría de Lighthouse en escritorio y móvil | Capturas |

Además se generaron las imágenes para compartir en redes (`public/og-image.jpg` y `public/og-projects.jpg`, de 1200 × 630) que el layout referencia, y las rutas de los proyectos se generan estáticas con `generateStaticParams`.

### Rutas
| Ruta | Contenido |
|---|---|
| `/` | Presentación y proyectos destacados |
| `/projects` | Todos los proyectos |
| `/projects/[slug]` | Detalle de un proyecto, por ejemplo `/projects/portal-proyectos` |
| `/about` | Sobre mí y habilidades técnicas |
| `/sitemap.xml` | Mapa del sitio generado |
| `/robots.txt` | Reglas para los buscadores |

### Resultados de Lighthouse
Auditoría de la versión de producción (`npm run build` y `npm start`), con el objetivo de la guía de más de 90 en todas las categorías:

| Modo | Rendimiento | Accesibilidad | Mejores prácticas | SEO |
|---|---|---|---|---|
| Escritorio | 100 | 100 | 100 | 100 |
| Móvil | 97 | 100 | 100 | 100 |

### Capturas
| Página | Captura |
|---|---|
| Inicio (`/`) | <img src="capturas/01_inicio.jpg" width="440"> |
| Proyectos (`/projects`) | <img src="capturas/02_proyectos.jpg" width="440"> |
| Detalle de un proyecto (`/projects/portal-proyectos`) | <img src="capturas/03_proyecto_detalle.jpg" width="440"> |
| Sobre mí (`/about`) | <img src="capturas/04_sobre_mi.jpg" width="440"> |
| `sitemap.xml` | <img src="capturas/05_sitemap.jpg" width="440"> |
| `robots.txt` | <img src="capturas/06_robots.jpg" width="440"> |
| Etiquetas `<meta>` y Open Graph del `<head>` | <img src="capturas/07_meta_tags_head.jpg" width="440"> |
| Lighthouse en escritorio | <img src="capturas/08_lighthouse_desktop.jpg" width="440"> |
| Lighthouse en móvil | <img src="capturas/09_lighthouse_mobile.jpg" width="440"> |

---

## Cómo ejecutarlo
```bash
cd my-portfolio
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

## Notas
- La dirección pública del sitio está en `siteUrl` (`src/lib/data.ts`) y se puede cambiar con la variable `NEXT_PUBLIC_SITE_URL`. De ahí salen la URL base de los meta tags, el sitemap y el `robots.txt`.
- Las imágenes de los proyectos son capturas de las aplicaciones de las semanas anteriores, guardadas en `public/projects`. La foto de perfil se carga desde GitHub, un dominio externo autorizado en `next.config.ts`.
- No se publican datos de contacto personales en el sitio.
- Las capturas y la auditoría se tomaron con la versión de producción en el puerto 3140, porque el 3000 estaba ocupado por otra aplicación.
