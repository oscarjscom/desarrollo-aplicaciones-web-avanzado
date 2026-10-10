import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.routes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => res.json({ message: 'API express-mongo-cloud funcionando' }));
app.use('/api/users', userRoutes);

app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Manejador global de errores: siempre responde { message, errors? }
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'La petición es demasiado grande' });
  if (err.code === 11000) return res.status(409).json({ message: 'Ese correo ya está registrado', errors: { email: 'Ese correo ya está registrado' } });
  if (err.name === 'ValidationError') {
    const errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
    return res.status(400).json({ message: 'Revisa los campos enviados', errors });
  }
  if (err.status) return res.status(err.status).json({ message: err.message, ...(err.errors && { errors: err.errors }) });
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

export default app;
