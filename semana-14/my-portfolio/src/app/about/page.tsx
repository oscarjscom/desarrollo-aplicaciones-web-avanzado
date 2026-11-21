import { Metadata } from 'next';
import Image from 'next/image';
import { personalInfo } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Sobre Mí',
  description: `Conoce más sobre ${personalInfo.name}, ${personalInfo.title}`,
};

export default function AboutPage() {
  const skills = [
    'JavaScript y TypeScript',
    'React y Next.js',
    'Node.js y Express',
    'PostgreSQL y MongoDB',
    'Tailwind CSS',
    'Git y GitHub',
    'Prisma y Supabase',
    'NextAuth.js y OAuth',
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Sobre Mí</h1>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image
                src={personalInfo.avatar}
                alt={personalInfo.name}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Hola! Soy {personalInfo.name}
            </h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                Soy estudiante de Tecsup y me apasiona crear experiencias web
                modernas. En el curso de Desarrollo de Aplicaciones Web Avanzado
                he construido aplicaciones completas con Next.js, desde el
                diseño de la interfaz hasta la base de datos y el despliegue.
              </p>
              <p>
                Mi enfoque está en escribir código limpio y ordenado, validar
                los datos tanto en el navegador como en el servidor y cuidar el
                rendimiento y el posicionamiento en buscadores.
              </p>
              <p>
                Cuando no estoy programando, me gusta aprender nuevas
                tecnologías y mejorar mis proyectos publicados en GitHub.
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section con lazy loading implícito */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Habilidades Técnicas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <div
                key={skill}
                className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <p className="font-semibold text-gray-800">{skill}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
