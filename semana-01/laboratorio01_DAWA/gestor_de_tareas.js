// CONEXION CON LA TERMINAL
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// DATOS DEL PROGRAMA
let tareas = [];
let contadorId = 1;

const CATEGORIAS = ['Estudio', 'Trabajo', 'Personal'];

// AGREGAR Y COMPLETAR TAREAS
function agregarTarea(titulo, descripcion, categoria) {
  const tarea = {
    id: contadorId++,
    titulo: titulo,
    descripcion: descripcion,
    categoria: categoria,
    estado: 'pendiente',
    fechaCreacion: new Date().toLocaleString()
  };

  tareas.push(tarea);
  console.log(`\nTarea agregada correctamente (Numero: ${tarea.id})\n`);
}

function completarTarea(id) {
  let tareaEncontrada = null;

  for (let i = 0; i < tareas.length; i++) {
    if (tareas[i].id === id) {
      tareaEncontrada = tareas[i];
      break;
    }
  }

  if (!tareaEncontrada) {
    console.log('\nNo se encontro una tarea con ese ID.\n');
    return;
  }

  if (tareaEncontrada.estado === 'completada') {
    console.log('\nEsa tarea ya estaba marcada como completada.\n');
    return;
  }

  tareaEncontrada.estado = 'completada';
  console.log('\nTarea "' + tareaEncontrada.titulo + '" marcada como completada.\n');
}

// MOSTRAR TAREAS
function formatearTarea(tarea) {
  return `[${tarea.id}] ${tarea.titulo} (${tarea.categoria})\n` +
         `      Descripcion: ${tarea.descripcion || '(sin descripcion)'}\n` +
         `      Estado: ${tarea.estado} | Creada: ${tarea.fechaCreacion}`;
}

function listarTareas(estado, categoria) {
  let cantidad = 0;

  for (let i = 0; i < tareas.length; i++) {
    const tarea = tareas[i];
    const coincideEstado = !estado || tarea.estado === estado;
    const coincideCategoria = !categoria || tarea.categoria === categoria;

    if (coincideEstado && coincideCategoria) {
      if (cantidad === 0) console.log('\nTareas:');
      console.log(formatearTarea(tarea));
      cantidad++;
    }
  }

  if (cantidad === 0) console.log('\n(No hay tareas para mostrar)\n');
  else console.log('');
}

// MENU PRINCIPAL
function mostrarMenu() {
  console.log('\nGESTOR DE TAREAS');
  console.log('1. Agregar tarea');
  console.log('2. Listar todas las tareas');
  console.log('3. Listar tareas pendientes');
  console.log('4. Listar tareas completadas');
  console.log('5. Marcar tarea como completada');
  console.log('6. Listar tareas por categoria');
  console.log('7. Salir');
  rl.question('Elige una opcion: ', manejarOpcion);
}

// OPCIONES DEL MENU
function manejarOpcion(opcion) {
  switch (opcion.trim()) {
    case '1':
      rl.question('Titulo de la tarea: ', function(titulo) {
        rl.question('Descripcion: ', function(descripcion) {
          console.log(`Categorias disponibles: ${CATEGORIAS.join(', ')}`);
          rl.question('Categoria: ', function(categoria) {
            categoria = categoria.trim();
            if (!CATEGORIAS.includes(categoria)) {
              console.log('\nCategoria no valida. Se usara "Personal" por defecto.\n');
              categoria = 'Personal';
            }
            agregarTarea(titulo.trim(), descripcion.trim(), categoria);
            mostrarMenu();
          });
        });
      });
      break;

    case '2':
      listarTareas();
      mostrarMenu();
      break;

    case '3':
      listarTareas('pendiente');
      mostrarMenu();
      break;

    case '4':
      listarTareas('completada');
      mostrarMenu();
      break;

    case '5':
      rl.question('Numero de la tarea que quieres completar: ', function(id) {
        completarTarea(parseInt(id.trim(), 10));
        mostrarMenu();
      });
      break;

    case '6':
      console.log(`Categorias disponibles: ${CATEGORIAS.join(', ')}`);
      rl.question('Que categoria desea ver?: ', function(categoria) {
        listarTareas(null, categoria.trim());
        mostrarMenu();
      });
      break;

    case '7':
      console.log('\nHasta luego.');
      rl.close();
      break;

    default:
      console.log('\nOpcion no valida. Intente nuevamente.\n');
      mostrarMenu();
      break;
  }
}

// INICIAR PROGRAMA
mostrarMenu();