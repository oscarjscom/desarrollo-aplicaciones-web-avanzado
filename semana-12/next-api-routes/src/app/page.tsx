const endpoints = [
  ["GET", "/api/authors", "Lista los autores"],
  ["POST", "/api/authors", "Crea un autor"],
  ["GET", "/api/authors/[id]", "Obtiene un autor por ID"],
  ["PUT", "/api/authors/[id]", "Actualiza un autor"],
  ["DELETE", "/api/authors/[id]", "Elimina un autor"],
  ["GET", "/api/authors/[id]/books", "Libros de un autor"],
  ["GET", "/api/books", "Lista los libros (filtros genre y authorId)"],
  ["POST", "/api/books", "Crea un libro"],
  ["GET", "/api/books/[id]", "Obtiene un libro por ID"],
  ["PUT", "/api/books/[id]", "Actualiza un libro"],
  ["DELETE", "/api/books/[id]", "Elimina un libro"],
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Biblioteca API</h1>
      <p className="mt-2 text-sm opacity-70">
        Endpoints de autores y libros. Se prueban con un cliente HTTP.
      </p>
      <ul className="mt-8 divide-y divide-black/10 dark:divide-white/10">
        {endpoints.map(([method, path, description]) => (
          <li key={method + path} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
            <span className="w-16 font-mono text-sm font-semibold">{method}</span>
            <code className="font-mono text-sm">{path}</code>
            <span className="text-sm opacity-70">{description}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
