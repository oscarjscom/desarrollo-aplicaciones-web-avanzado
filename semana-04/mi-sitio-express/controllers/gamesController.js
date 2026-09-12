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

const index = (req, res) => {
  res.render("games", { games });
};

const create = (req, res) => {
  const { titulo, genero, plataforma, anio, desarrollador, calificacion, imagen } = req.body;

  games.push({
    id: Date.now(),
    titulo,
    genero,
    plataforma,
    anio,
    desarrollador,
    calificacion,
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
