/**
 * GET /api/popups
 * Public endpoint — returns currently active promotional popups for the
 * site to render. No auth (visitors need this).
 */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Popup } from '@/models/Popup';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const popups = await Popup.find({ active: true }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ ok: true, popups }, { status: 200 });
  } catch (err) {
    console.error('[popups] failed to load active popups:', err);
    return NextResponse.json({ ok: true, popups: [] }, { status: 200 });
  }
}
