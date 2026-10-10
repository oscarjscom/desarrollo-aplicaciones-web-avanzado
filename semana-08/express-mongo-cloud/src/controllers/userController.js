import { userService } from '../services/userService.js';

// Cada función delega los errores al manejador global con next(err)
export const userController = {
  async getAll(req, res, next) {
    try {
      res.json(await userService.getAll());
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      res.json(await userService.getById(req.params.id));
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      res.status(201).json(await userService.create(req.body));
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      res.json(await userService.update(req.params.id, req.body));
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      await userService.remove(req.params.id);
      res.status(204).end();
    } catch (err) { next(err); }
  }
};
