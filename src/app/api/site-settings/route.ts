import { NextRequest, NextResponse } from 'next/server';
import { AuthError, getSessionUser, getSiteSettings, saveSiteSettings, type SiteSettings } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET() {
  return NextResponse.json({ settings: await getSiteSettings() }, { headers: { 'Cache-Control': 'no-store' } });
}
export async function PUT(request: NextRequest) {
  try {
    const actor = await getSessionUser(request);
    if (!actor || actor.role !== 'admin') throw new AuthError('Acesso restrito a administradores.', 403);
    const body = await request.json() as Partial<SiteSettings>;
    const previous = await getSiteSettings();
    const theme = body.theme === 'natal' ? 'natal' : body.theme === 'padrao' ? 'padrao' : previous.theme;
    const announcement = body.announcement ? {
      enabled: Boolean(body.announcement.enabled),
      title: String(body.announcement.title || '').trim().slice(0, 90),
      message: String(body.announcement.message || '').trim().slice(0, 300),
    } : previous.announcement;
    if (announcement.enabled && (!announcement.title || !announcement.message)) throw new AuthError('Preencha o título e a mensagem do aviso do site.');
    const settings: SiteSettings = { theme, announcement };
    await saveSiteSettings(settings);
    return NextResponse.json({ settings });
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Não foi possível salvar as configurações.' }, { status });
  }
}
