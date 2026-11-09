import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, isAuthConfigured } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ user: await getSessionUser(request), configured: isAuthConfigured() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ user: null, configured: false }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
