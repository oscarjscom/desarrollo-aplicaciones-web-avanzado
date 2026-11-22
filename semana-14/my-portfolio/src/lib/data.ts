import { Project } from '@/types';

const REPO = 'https://github.com/oscarjscom/desarrollo-aplicaciones-web-avanzado/tree/main';

export const projects: Project[] = [
  {
    slug: 'portal-proyectos',
    title: 'Portal de proyectos',
    description:
      'Aplicación para gestionar proyectos, equipo y tareas, con formularios validados, calendario y paginación',
    image: '/projects/portal-proyectos.jpg',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    demoUrl: 'https://portal-proyectos-delta.vercel.app',
    githubUrl: `${REPO}/semana-11/next-shadcn-ui`,
    featured: true,
  },
  {
    slug: 'biblioteca-api',
    title: 'Biblioteca con API propia',
    description:
      'Sistema de autores y libros con API Routes, búsqueda con paginación y estadísticas sobre PostgreSQL',
    image: '/projects/biblioteca-api.jpg',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Supabase'],
    demoUrl: 'https://biblioteca-api-routes.vercel.app',
    githubUrl: `${REPO}/semana-12/next-api-routes`,
    featured: true,
  },
  {
    slug: 'next-auth-app',
    title: 'Autenticación con NextAuth',
    description:
      'Inicio de sesión con Google, GitHub y correo con contraseña cifrada, registro y bloqueo por intentos fallidos',
    image: '/projects/next-auth-app.jpg',
    technologies: ['NextAuth.js', 'bcrypt', 'OAuth 2.0', 'Prisma'],
    demoUrl: 'https://next-auth-app-amber.vercel.app',
    githubUrl: `${REPO}/semana-13/next-auth-app`,
    featured: true,
  },
  {
    slug: 'galeria-peliculas',
    title: 'Galería de películas',
    description:
      'Galería con búsqueda y filtros que combina renderizado en el cliente (CSR) y en el servidor (SSR)',
    image: '/projects/galeria-peliculas.jpg',
    technologies: ['Next.js', 'SSR', 'CSR', 'Axios'],
    demoUrl: 'https://galeria-peliculas-three.vercel.app',
    githubUrl: `${REPO}/semana-09/galeria-peliculas`,
    featured: false,
  },
  {
    slug: 'pokedex-isr',
    title: 'Pokédex con SSG e ISR',
    description:
      'Pokédex con páginas estáticas, regeneración incremental (ISR) y carga diferida de imágenes',
    image: '/projects/pokedex-isr.jpg',
    technologies: ['Next.js', 'SSG', 'ISR', 'TypeScript'],
    githubUrl: `${REPO}/semana-10/next-ssg-isr-app`,
    featured: false,
  },
];

export const personalInfo = {
  name: 'Oscar Olano Paniora',
  title: 'Desarrollador Web Full Stack',
  description:
    'Estudiante de Tecsup que crea aplicaciones web modernas con Next.js, React y bases de datos en la nube',
  github: 'https://github.com/oscarjscom',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oscarjscom.me',
  avatar: 'https://avatars.githubusercontent.com/u/229425953?v=4',
};
