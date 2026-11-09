import { NextRequest, NextResponse } from 'next/server';
import { AuthError, getSessionUser, getUserById, listUsers, updateUser, type UserRole } from '@/lib/auth';
export const runtime = 'nodejs';
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: NextRequest, context: Context) {
  try {
    const actor = await getSessionUser(request);
    if (!actor || actor.role !== 'admin') throw new AuthError('Acesso restrito a administradores.', 403);
    const { id } = await context.params;
    const body = await request.json() as { name?: string; role?: UserRole; active?: boolean; password?: string };
    const target = await getUserById(id);
    if (!target) throw new AuthError('Usuário não encontrado.', 404);
    if (actor.id === id && ((body.role && body.role !== 'admin') || body.active === false)) throw new AuthError('Você não pode remover ou suspender seu próprio acesso administrativo.', 409);
    if (body.name !== undefined && (body.name.trim().length < 2 || body.name.trim().length > 80)) throw new AuthError('O nome deve ter entre 2 e 80 caracteres.');
    if (body.role !== undefined && body.role !== 'admin' && body.role !== 'user') throw new AuthError('Perfil de acesso inválido.');
    if (body.active !== undefined && typeof body.active !== 'boolean') throw new AuthError('Estado de acesso inválido.');
    if (body.password !== undefined && body.password.length < 10) throw new AuthError('A nova senha deve ter pelo menos 10 caracteres.');
    const willLoseAdmin = target.role === 'admin' && target.active && ((body.role && body.role !== 'admin') || body.active === false);
    if (willLoseAdmin) {
      const activeAdmins = (await listUsers()).filter((user) => user.role === 'admin' && user.active);
      if (activeAdmins.length <= 1) throw new AuthError('O site precisa manter pelo menos um administrador ativo.', 409);
    }
    const user = await updateUser(id, body);
    return NextResponse.json({ user });
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Não foi possível atualizar o usuário.' }, { status });
  }
}
