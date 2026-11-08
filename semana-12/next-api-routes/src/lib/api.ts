import type { FieldErrors } from '@/lib/validation'

export class ApiError extends Error {
  status: number
  errors?: FieldErrors

  constructor(message: string, status: number, errors?: FieldErrors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

// Llama a una API Route; si la respuesta no es correcta lanza un ApiError con el mensaje del servidor
export async function api<T>(url: string, init: Omit<RequestInit, 'body'> & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init
  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      headers: { ...(json !== undefined && { 'Content-Type': 'application/json' }), ...headers },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError('No se pudo conectar con el servidor', 0)
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(data?.error ?? 'Ocurrió un error inesperado', response.status, data?.errors)
  }
  return data as T
}

export const messageOf = (error: unknown) =>
  error instanceof ApiError ? error.message : 'Ocurrió un error inesperado'
