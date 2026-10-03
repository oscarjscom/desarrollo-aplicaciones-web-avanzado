import express from 'express';
import UserController from '../controllers/UserController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// GET /api/users (solo el rol Admin)
router.get('/', authenticate, authorize(['admin']), UserController.getAll);

// Rutas del propio usuario (cualquier usuario autenticado). Van antes de "/:id".
router.get('/me', authenticate, authorize([]), UserController.getMe);
router.put('/me', authenticate, authorize([]), UserController.updateMe);
router.put('/me/password', authenticate, authorize([]), UserController.changeMyPassword);

// GET /api/users/:id (solo el rol Admin: ver la información de un usuario)
router.get('/:id', authenticate, authorize(['admin']), UserController.getById);

export default router;
