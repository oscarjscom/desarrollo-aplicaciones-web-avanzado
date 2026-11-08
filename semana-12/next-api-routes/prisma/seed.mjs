// Datos de ejemplo de la biblioteca. Se puede ejecutar varias veces: no duplica autores ni libros.
// Uso: npm run seed
import { PrismaClient } from '@prisma/client'

// Lee DATABASE_URL del archivo .env de la raíz del proyecto
try {
  process.loadEnvFile()
} catch {}

const prisma = new PrismaClient()

const authors = [
  {
    name: 'Mario Vargas Llosa',
    email: 'vargasllosa@demo-lab12.test',
    nationality: 'Perú',
    birthYear: 1936,
    bio: 'Premio Nobel de Literatura 2010',
    books: [
      ['La ciudad y los perros', 1963, 'Novela', 402],
      ['Conversación en La Catedral', 1969, 'Novela', 601],
      ['La fiesta del chivo', 2000, 'Novela', 520],
      ['Pantaleón y las visitadoras', 1973, 'Novela', 304],
    ],
  },
  {
    name: 'Julio Cortázar',
    email: 'cortazar@demo-lab12.test',
    nationality: 'Argentina',
    birthYear: 1914,
    bio: 'Autor de Rayuela y maestro del cuento fantástico',
    books: [
      ['Rayuela', 1963, 'Novela', 600],
      ['Bestiario', 1951, 'Cuento', 160],
      ['Historias de cronopios y de famas', 1962, 'Cuento', 140],
    ],
  },
  {
    name: 'Isabel Allende',
    email: 'allende@demo-lab12.test',
    nationality: 'Chile',
    birthYear: 1942,
    bio: 'Autora de La casa de los espíritus',
    books: [
      ['La casa de los espíritus', 1982, 'Novela', 433],
      ['Paula', 1994, 'Memorias', 330],
      ['Amor y otros demonios del destino', 2001, 'Ensayo', 210],
    ],
  },
]

let createdBooks = 0

for (const { books, ...data } of authors) {
  const author = await prisma.author.upsert({
    where: { email: data.email },
    update: {},
    create: data,
  })

  for (const [title, publishedYear, genre, pages] of books) {
    const exists = await prisma.book.findFirst({ where: { title, authorId: author.id } })
    if (exists) continue
    await prisma.book.create({
      data: { title, publishedYear, genre, pages, description: `Libro de ${author.name}`, authorId: author.id },
    })
    createdBooks++
  }
}

const [totalAuthors, totalBooks] = await Promise.all([prisma.author.count(), prisma.book.count()])
console.log(`Libros nuevos: ${createdBooks} · Total en la base: ${totalAuthors} autores y ${totalBooks} libros`)

await prisma.$disconnect()
