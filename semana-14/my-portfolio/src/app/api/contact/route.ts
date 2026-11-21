import { NextResponse } from 'next/server';
import { validateContact } from '@/lib/validation';

// POST - Recibe el mensaje del formulario de contacto
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'El cuerpo debe ser un JSON válido' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'El cuerpo debe ser un JSON válido' }, { status: 400 });
  }

  // Validación en el servidor (las mismas reglas que el formulario)
  const { valid, errors, data } = validateContact(body as Record<string, unknown>);
  if (!valid) {
    return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 400 });
  }

  // El mensaje queda registrado en el servidor
  console.log('Mensaje de contacto recibido:', {
    name: data.name,
    email: data.email,
    subject: data.subject,
    length: data.message.length,
  });

  return NextResponse.json({ ok: true, message: 'Mensaje recibido' }, { status: 201 });
}
