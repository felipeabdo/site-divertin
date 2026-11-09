import { NextRequest, NextResponse } from 'next/server';
import { AuthError, createUser, getSessionUser, isValidEmail, listUsers, type UserRole } from '@/lib/auth';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  try {
    const actor = await getSessionUser(request);
    if (!actor || actor.role !== 'admin') throw new AuthError('Acesso restrito a administradores.', 403);
    return NextResponse.json({ users: await listUsers() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Não foi possível listar os usuários.' }, { status });
  }
}
export async function POST(request: NextRequest) {
  try {
    const actor = await getSessionUser(request);
    if (!actor || actor.role !== 'admin') throw new AuthError('Acesso restrito a administradores.', 403);
    const body = await request.json() as { name?: string; email?: string; password?: string; role?: UserRole };
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role: UserRole = body.role === 'admin' ? 'admin' : 'user';
    if (name.length < 2 || name.length > 80) throw new AuthError('O nome deve ter entre 2 e 80 caracteres.');
    if (!isValidEmail(email)) throw new AuthError('Informe um e-mail válido.');
    if (password.length < 10) throw new AuthError('A senha inicial deve ter pelo menos 10 caracteres.');
    const user = await createUser({ name, email, password, role });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Não foi possível criar o usuário.' }, { status });
  }
}
