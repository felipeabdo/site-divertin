import { NextRequest, NextResponse } from 'next/server';
import { AuthError, clearLoginRateLimit, createSessionToken, ensureInitialAdmin, enforceLoginRateLimit, getUserByEmail, setSessionCookie, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await ensureInitialAdmin();
    const rateKey = await enforceLoginRateLimit(request);
    const body = await request.json() as { email?: string; password?: string };
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || !password) throw new AuthError('Informe e-mail e senha.');
    const user = await getUserByEmail(email);
    const valid = Boolean(user && user.active && await verifyPassword(password, user.passwordHash));
    if (!valid || !user) throw new AuthError('E-mail ou senha inválidos.', 401);
    await clearLoginRateLimit(rateKey);
    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, active: user.active, createdAt: user.createdAt } });
    setSessionCookie(response, createSessionToken(user.id));
    return response;
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Não foi possível entrar.' }, { status });
  }
}
