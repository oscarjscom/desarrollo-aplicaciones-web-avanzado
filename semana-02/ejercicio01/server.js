// Importar el módulo http nativo de Node.js
const http = require("http");

// Definir el puerto del servidor
const PORT = 3000;

// Crear el servidor
const server = http.createServer((req, res) => {
  // Configurar cabecera de respuesta
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  // Manejo básico de rutas
  if (req.url === "/") {
    res.statusCode = 200;
    res.end("<h1>Bienvenido al servidor Node.js 🚀</h1>");
  } else if (req.url === "/about") {
    res.statusCode = 200;
    res.end("<h1>Acerca de nosotros</h1><p>Este es un servidor básico.</p>");
  } else if (req.url === "/contact") {
    res.statusCode = 200;
    res.end("<h1>Contacto</h1><p>Escríbenos a contacto@ejemplo.com</p>");
  } else if (req.url === "/services") {
    res.statusCode = 200;
    res.end("<h1>Servicios</h1><ul><li>Desarrollo web</li><li>Aplicaciones móviles</li><li>Consultoría IT</li><li>Soporte técnico</li></ul>");
  } else if (req.url === "/error") {
    res.statusCode = 500;
    res.end("<h1>500 - Error interno del servidor</h1>");
  } else {
    res.statusCode = 404;
    res.end("<h1>404 - Página no encontrada</h1>");
  }
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});