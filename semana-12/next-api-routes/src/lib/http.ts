import { NextResponse } from 'next/server'
import { firstError, type FieldErrors } from '@/lib/validation'

export function jsonError(message: string, status: number, errors?: FieldErrors) {
  return NextResponse.json(errors ? { error: message, errors } : { error: message }, { status })
}

export const validationError = (errors: FieldErrors) => jsonError(firstError(errors), 400, errors)

// Lee el cuerpo JSON; devuelve null si no es un objeto válido
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json()
    return body && typeof body === 'object' && !Array.isArray(body) ? body : null
  } catch {
    return null
  }
}

// Código de error de Prisma (P2002: valor único repetido, P2025: registro no encontrado)
export function prismaCode(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code: unknown }).code)
    : undefined
}
