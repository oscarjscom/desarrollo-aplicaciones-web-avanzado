import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import pageRoutes from './routes/pages.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Habilitar CORS para todos
app.use(cors());

// Cuerpos JSON de máximo 10 KB: evita que alguien sature el servidor con peticiones gigantes
app.use(express.json({ limit: '10kb' }));

// Archivos estáticos y las reglas de validación compartidas con el navegador
app.use(express.static(path.join(__dirname, 'public')));
app.use('/shared', express.static(path.join(__dirname, 'shared')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Validar estado del servidor
app.get('/health', (req, res) => res.status(200).json({ ok: true, uptime: Math.round(process.uptime()) }));

// Rutas de la API que no existen: respuesta JSON
app.use('/api', (req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Páginas del frontend
app.use('/', pageRoutes);

// Página 404 para cualquier otra ruta
app.use((req, res) => res.status(404).render('404', { title: 'Página no encontrada', url: req.originalUrl }));

// Manejador global de errores
app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message || 'Error interno del servidor';
    let errors = err.errors && !(err.name === 'ValidationError') ? err.errors : undefined;

    if (err.type === 'entity.parse.failed') { status = 400; message = 'El cuerpo de la petición no es un JSON válido'; }
    if (err.type === 'entity.too.large') { status = 413; message = 'La petición es demasiado grande'; }
    if (err.code === 11000) { status = 409; message = 'El email ya se encuentra en uso'; errors = { email: 'Este correo ya está registrado' }; }
    if (err.name === 'ValidationError') {
        // Error del esquema de Mongoose (última capa de validación)
        status = 400;
        message = 'Revisa los campos marcados';
        errors = Object.fromEntries(Object.entries(err.errors).map(([field, e]) => [field, e.message]));
    }

    if (status >= 500) console.error(err);

    if (req.originalUrl.startsWith('/api')) {
        return res.status(status).json(errors ? { message, errors } : { message });
    }
    res.status(status).render('404', { title: 'Error', url: req.originalUrl });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
    .then( async () => {
        console.log('Mongo connected');
        await seedRoles();
        await seedUsers();
        app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
    })
    .catch(err => {
        console.error('Error al conectar con Mongo:', err);
        process.exit(1);
    });
