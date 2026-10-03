// Errores con código HTTP que el manejador global convierte en respuestas JSON.

export class HttpError extends Error {
    constructor(status, message, errors) {
        super(message);
        this.status = status;
        if (errors) this.errors = errors; // { campo: 'mensaje' }
    }
}

export const badRequest = (errors, message = 'Revisa los campos marcados') => new HttpError(400, message, errors);
export const unauthorized = (message = 'Credenciales inválidas') => new HttpError(401, message);
export const notFound = (message) => new HttpError(404, message);
export const conflict = (message, errors) => new HttpError(409, message, errors);
