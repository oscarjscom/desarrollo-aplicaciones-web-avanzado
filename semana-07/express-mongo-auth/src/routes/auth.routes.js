import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/signUp', AuthController.signUp);
router.post('/signIn', AuthController.signIn);

// POST /api/auth/email-available { email } (validación asíncrona del formulario de registro).
// Va por POST para que el correo no quede escrito en la URL ni en los registros del servidor.
router.post('/email-available', AuthController.emailAvailable);

export default router;
