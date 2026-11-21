# my-portfolio · Portafolio personal con SEO

Portafolio hecho con Next.js (https://oscarjscom.duckdns.org), con meta tags dinámicos, Open Graph, imágenes optimizadas, `sitemap.xml` y `robots.txt`.

| Parte | Archivos |
|---|---|
| Datos del portafolio y de los proyectos | `src/lib/data.ts`, `src/types/index.ts` |
| Meta tags globales y dinámicos | `src/app/layout.tsx`, `src/app/projects/[slug]/page.tsx` |
| Páginas | `src/app/page.tsx`, `src/app/projects/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/not-found.tsx` |
| Contacto (tarea) | `src/components/ContactForm.tsx`, `src/lib/validation.ts`, `src/app/api/contact/route.ts` |
| Componentes | `src/components/Header.tsx`, `NavLinks.tsx`, `Footer.tsx`, `ProjectCard.tsx`, `TechMarquee.tsx`, `Icons.tsx` |
| Imágenes optimizadas | `next.config.ts` |
| SEO para buscadores | `src/app/sitemap.ts`, `src/app/robots.ts` |

## Ejecutar
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```
