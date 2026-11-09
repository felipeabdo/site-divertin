import { NextRequest, NextResponse } from 'next/server';
import { AuthError, getSessionUser, getUserById, updateUser, verifyPassword } from '@/lib/auth';
export const runtime = 'nodejs';
export async function PATCH(request: NextRequest) {
  try {
    const current = await getSessionUser(request);
    if (!current) throw new AuthError('Entre novamente para alterar seu cadastro.', 401);
    const body = await request.json() as { name?: string; currentPassword?: string; newPassword?: string };
    if (body.name !== undefined && (body.name.trim().length < 2 || body.name.trim().length > 80)) throw new AuthError('O nome deve ter entre 2 e 80 caracteres.');
    if (body.newPassword) {
      const stored = await getUserById(current.id);
      if (!stored || !body.currentPassword || !await verifyPassword(body.currentPassword, stored.passwordHash)) throw new AuthError('A senha atual não confere.', 401);
      if (body.newPassword.length < 10) throw new AuthError('A nova senha deve ter pelo menos 10 caracteres.');
    }
    const user = await updateUser(current.id, { ...(body.name !== undefined ? { name: body.name } : {}), ...(body.newPassword ? { password: body.newPassword } : {}) });
    return NextResponse.json({ user });
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Não foi possível atualizar o cadastro.' }, { status });
  }
}
