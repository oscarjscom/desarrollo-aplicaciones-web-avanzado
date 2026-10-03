import express from 'express';

// Páginas del frontend. El servidor solo entrega la vista: el token vive en sessionStorage,
// así que cada página comprueba la sesión y el rol en el navegador, y los datos llegan
// desde la API, que es la que de verdad protege la información con JWT.
const router = express.Router();

const page = (view, title, extra = {}) => (req, res) => res.render(view, { title, ...extra });

router.get('/', page('index', 'Custodia'));
router.get('/signIn', page('signIn', 'Iniciar sesión'));
router.get('/signUp', page('signUp', 'Crear cuenta'));
router.get('/dashboard', page('dashboard', 'Mi panel', { auth: { roles: ['user', 'admin'] } }));
router.get('/profile', page('profile', 'Mi cuenta', { auth: { roles: [] } }));
router.get('/admin', page('admin', 'Administración', { auth: { roles: ['admin'] } }));
router.get('/403', (req, res) => res.status(403).render('403', { title: 'Acceso denegado' }));

export default router;
