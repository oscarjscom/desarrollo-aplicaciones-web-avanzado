// "Base de datos" en memoria para videojuegos (precargada con algunos títulos destacados)
const games = [
  {
    id: 1,
    titulo: "God of War",
    genero: "Acción",
    plataforma: "PlayStation",
    anio: 2018,
    desarrollador: "Santa Monica Studio",
    calificacion: 10,
    imagen: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
    imagenFondo: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/library_hero.jpg"
  },
  {
    id: 2,
    titulo: "Grand Theft Auto: Vice City",
    genero: "Acción",
    plataforma: "PC",
    anio: 2002,
    desarrollador: "Rockstar North",
    calificacion: 9,
    imagen: "https://cdn.akamai.steamstatic.com/steam/apps/12110/header.jpg",
    imagenFondo: "https://cdn.akamai.steamstatic.com/steam/apps/12110/library_hero.jpg"
  },
  {
    id: 3,
    titulo: "Elden Ring",
    genero: "RPG",
    plataforma: "PC",
    anio: 2022,
    desarrollador: "FromSoftware",
    calificacion: 10,
    imagen: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    imagenFondo: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_hero.jpg"
  },
  {
    id: 4,
    titulo: "EA Sports FC 24",
    genero: "Deportes",
    plataforma: "PC",
    anio: 2023,
    desarrollador: "EA Sports",
    calificacion: 8,
    imagen: "https://cdn.akamai.steamstatic.com/steam/apps/2195250/header.jpg",
    imagenFondo: "https://cdn.akamai.steamstatic.com/steam/apps/2195250/library_hero.jpg"
  },
  {
    id: 5,
    titulo: "Minecraft Dungeons",
    genero: "Aventura",
    plataforma: "PC",
    anio: 2020,
    desarrollador: "Mojang Studios",
    calificacion: 7,
    imagen: "https://cdn.akamai.steamstatic.com/steam/apps/1672970/header.jpg",
    imagenFondo: "https://cdn.akamai.steamstatic.com/steam/apps/1672970/library_hero.jpg"
  }
];

const PLACEHOLDER_IMG = "https://placehold.co/460x215/1c1e22/f5f3ee?text=Sin+imagen";
const GENEROS_VALIDOS = ["Acción", "Aventura", "RPG", "Deportes", "Estrategia", "Terror", "Simulación"];
const PLATAFORMAS_VALIDAS = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Móvil"];

const index = (req, res) => {
  res.render("games", { games, errors: [], old: {} });
};

const create = (req, res) => {
  const { titulo, genero, plataforma, anio, desarrollador, calificacion, imagen } = req.body;

  const errors = [];
  const anioNum = parseInt(anio, 10);
  const calificacionNum = parseFloat(calificacion);
  const anioMaximo = new Date().getFullYear() + 1;

  if (!titulo || !titulo.trim()) {
    errors.push("El título es obligatorio.");
  }
  if (!desarrollador || !desarrollador.trim()) {
    errors.push("El desarrollador es obligatorio.");
  }
  if (!GENEROS_VALIDOS.includes(genero)) {
    errors.push("Debes elegir un género válido de la lista.");
  }
  if (!PLATAFORMAS_VALIDAS.includes(plataforma)) {
    errors.push("Debes elegir una plataforma válida de la lista.");
  }
  if (!anio || Number.isNaN(anioNum) || anioNum < 1970 || anioNum > anioMaximo) {
    errors.push(`El año debe ser un número entre 1970 y ${anioMaximo}.`);
  }
  if (!calificacion || Number.isNaN(calificacionNum) || calificacionNum < 1 || calificacionNum > 10) {
    errors.push("La calificación debe ser un número entre 1 y 10.");
  }
  if (imagen && imagen.trim() && !/^https?:\/\/.+/i.test(imagen.trim())) {
    errors.push("La URL de la imagen debe empezar con http:// o https://.");
  }

  if (errors.length > 0) {
    return res.status(400).render("games", {
      games,
      errors,
      old: { titulo, genero, plataforma, anio, desarrollador, calificacion, imagen }
    });
  }

  games.push({
    id: Date.now(),
    titulo: titulo.trim(),
    genero,
    plataforma,
    anio: anioNum,
    desarrollador: desarrollador.trim(),
    calificacion: calificacionNum,
    imagen: imagen && imagen.trim() ? imagen.trim() : PLACEHOLDER_IMG
  });

  res.redirect("/games");
};

const gamesController = {
  index,
  create,
  games
};

module.exports = gamesController;
