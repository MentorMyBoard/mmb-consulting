/**
 * /api/admin/popups
 * Protected by proxy.ts Basic Auth (matcher includes /api/admin/:path*).
 *
 * GET  — list every popup (active + hidden) for the admin table.
 * POST — create a new popup.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { popupCreateSchema } from '@/lib/validations';
import { connectToDatabase } from '@/lib/mongodb';
import { Popup } from '@/models/Popup';
import { errorDetail } from '@/lib/errors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const popups = await Popup.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, popups }, { status: 200 });
  } catch (err) {
    console.error('[admin/popups] failed to list popups:', err);
    return NextResponse.json(
      { ok: false, error: `Failed to load popups: ${errorDetail(err)}` },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
    }

    const parsed = popupCreateSchema.parse(body);

    await connectToDatabase();
    const popup = await Popup.create({
      ...parsed,
      buttonText: parsed.buttonText || undefined,
      buttonUrl: parsed.buttonUrl || undefined,
    });

    return NextResponse.json({ ok: true, popup }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: err.issues[0]?.message || 'Invalid popup data.' },
        { status: 400 },
      );
    }
    console.error('[admin/popups] failed to create popup:', err);
    return NextResponse.json(
      { ok: false, error: `Something went wrong: ${errorDetail(err)}` },
      { status: 500 },
    );
  }
}
