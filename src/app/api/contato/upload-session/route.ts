import { NextResponse } from 'next/server';
import { contactUploadCookieName, createContactUploadSession, hasSameOrigin } from '@/lib/contactSecurity';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ message: 'Solicitação não autorizada.' }, { status: 403 });
  }

  try {
    const session = createContactUploadSession();
    const response = NextResponse.json({ message: 'Sessão de upload iniciada.' }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
    response.cookies.set(contactUploadCookieName(), session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/contato',
      maxAge: session.maxAge,
    });
    return response;
  } catch {
    return NextResponse.json(
      { message: 'O envio de anexos está temporariamente indisponível.' },
      { status: 503 },
    );
  }
}
