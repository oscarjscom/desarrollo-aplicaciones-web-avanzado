import mongoose from 'mongoose';
import { userRepository } from '../repositories/userRepository.js';
import { HttpError } from '../utils/httpErrors.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Revisa lo que llega por el cuerpo de la petición. Solo se aceptan "name" y "email", como texto.
function validate(data, { partial = false } = {}) {
  const errors = {};
  const clean = {};
  for (const field of ['name', 'email']) {
    const value = data?.[field];
    if (value === undefined) {
      if (!partial) errors[field] = field === 'name' ? 'El nombre es obligatorio' : 'El correo es obligatorio';
      continue;
    }
    if (typeof value !== 'string') { errors[field] = 'Formato inválido'; continue; }
    const text = value.trim();
    if (field === 'name' && (text.length < 2 || text.length > 60)) errors.name = 'El nombre debe tener entre 2 y 60 caracteres';
    else if (field === 'email' && !EMAIL_RE.test(text)) errors.email = 'El correo no tiene un formato válido';
    else clean[field] = text;
  }
  if (Object.keys(errors).length) throw new HttpError(400, 'Revisa los campos enviados', errors);
  if (partial && !Object.keys(clean).length) throw new HttpError(400, 'No hay campos para actualizar');
  return clean;
}

function checkId(id) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, 'Usuario no encontrado');
}

export const userService = {
  getAll: () => userRepository.getAll(),

  async getById(id) {
    checkId(id);
    const user = await userRepository.getById(id);
    if (!user) throw new HttpError(404, 'Usuario no encontrado');
    return user;
  },

  create: (data) => userRepository.create(validate(data)),

  async update(id, data) {
    checkId(id);
    const user = await userRepository.update(id, validate(data, { partial: true }));
    if (!user) throw new HttpError(404, 'Usuario no encontrado');
    return user;
  },

  async remove(id) {
    checkId(id);
    const user = await userRepository.remove(id);
    if (!user) throw new HttpError(404, 'Usuario no encontrado');
  }
};
