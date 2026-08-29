const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 3000;

// Función auxiliar para leer, compilar y renderizar una vista
function renderView(res, view, data) {
  const filePath = path.join(__dirname, "views", view);
  fs.readFile(filePath, "utf8", (err, templateData) => {
    if (err) {
      res.statusCode = 500;
      res.end("Error interno del servidor");
      return;
    }
    const template = handlebars.compile(templateData);
    const html = template(data);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    renderView(res, "home.hbs", {
      title: "Servidor con Handlebars 🚀",
      welcomeMessage: "Bienvenido al laboratorio de Node.js",
      day: new Date().toLocaleDateString("es-PE"),
      students: ["Ana", "Luis", "Pedro", "María"],
    });

    } else if (req.url === "/about") {
    renderView(res, "about.hbs", {
      title: "Acerca de la clase",
      curso: "Desarrollo de Aplicaciones Web Avanzado",
      profesor: "Arévalo Sermeño, Edwin William",
      fecha: new Date().toLocaleDateString("es-PE"),
    });
    
  } else if (req.url === "/students") {
    // Notas de los estudiantes
    const students = [
      { nombre: "Ana", nota: 18 },
      { nombre: "Luis", nota: 12 },
      { nombre: "Pedro", nota: 16 },
      { nombre: "María", nota: 14 },
    ];

    // Marcar como destacado a quien tenga nota mayor a 15
    students.forEach((s) => {
      s.destacado = s.nota > 15;
    });

    renderView(res, "students.hbs", {
      title: "Lista de estudiantes",
      students: students,
    });

  } else {
    res.statusCode = 404;
    res.end("<h1>404 - Página no encontrada</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});