/**
 * GET /api/popups
 * Public endpoint — returns currently active promotional popups. Kept for
 * completeness; the homepage itself no longer calls this (it embeds popups
 * directly via lib/popups.ts at render time so there's no client round-trip).
 */
import { NextResponse } from 'next/server';
import { getActivePopups } from '@/lib/popups';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const popups = await getActivePopups();
  return NextResponse.json({ ok: true, popups }, { status: 200 });
}
