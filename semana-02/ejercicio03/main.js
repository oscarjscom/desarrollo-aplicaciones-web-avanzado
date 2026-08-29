const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

// Función auxiliar: valida campos obligatorios al crear
function validarEstudiante(data) {
  const errores = [];
  if (!data.name || data.name.trim() === "") errores.push("nombre");
  if (!data.email || data.email.trim() === "") errores.push("correo");
  if (!data.course || data.course.trim() === "") errores.push("carrera");
  if (!data.phone || data.phone.trim() === "") errores.push("número de celular");
  return errores;
}

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const { method, url } = req;

  // RUTA: GET /students  → listar todos
  if (url === "/students" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify(repo.getAll()));
  }

  // RUTA: GET /students/:id → obtener uno
  else if (url.startsWith("/students/") && method === "GET") {
    const id = parseInt(url.split("/")[2]);
    const student = repo.getById(id);
    if (student) {
      res.statusCode = 200;
      res.end(JSON.stringify(student));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
    }
  }

  // RUTA: POST /students → crear (con validación)
  else if (url === "/students" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const data = JSON.parse(body);
      const errores = validarEstudiante(data);

      if (errores.length > 0) {
        res.statusCode = 400;
        res.end(JSON.stringify({
          error: "Faltan campos obligatorios",
          campos: errores
        }));
        return;
      }

      const newStudent = repo.create(data);
      res.statusCode = 201;
      res.end(JSON.stringify(newStudent));
    });
  }

  // RUTA: PUT /students/:id → actualizar
  else if (url.startsWith("/students/") && method === "PUT") {
    const id = parseInt(url.split("/")[2]);
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const updated = repo.update(id, JSON.parse(body));
      if (updated) {
        res.statusCode = 200;
        res.end(JSON.stringify(updated));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
      }
    });
  }

  // RUTA: DELETE /students/:id → eliminar
  else if (url.startsWith("/students/") && method === "DELETE") {
    const id = parseInt(url.split("/")[2]);
    const deleted = repo.remove(id);
    if (deleted) {
      res.statusCode = 200;
      res.end(JSON.stringify(deleted));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
    }
  }

  // RUTA: POST /ListByStatus → listar por estado
  else if (url === "/ListByStatus" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { status } = JSON.parse(body);
      if (!status) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Debe enviar el campo 'status'" }));
        return;
      }
      res.statusCode = 200;
      res.end(JSON.stringify(repo.getByStatus(status)));
    });
  }

  // RUTA: POST /ListByGrade → listar por promedio (gpa)
  else if (url === "/ListByGrade" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { gpa } = JSON.parse(body);
      if (gpa === undefined) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Debe enviar el campo 'gpa'" }));
        return;
      }
      res.statusCode = 200;
      res.end(JSON.stringify(repo.getByGrade(gpa)));
    });
  }
  
  // RUTA no encontrada
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});