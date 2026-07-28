/**
 * /api/admin/popups/[id]
 * Protected by proxy.ts Basic Auth (matcher includes /api/admin/:path*).
 *
 * PATCH  — partial update (full edits, or a one-click active/hidden toggle).
 * DELETE — remove a popup.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { ZodError } from 'zod';
import { popupUpdateSchema } from '@/lib/validations';
import { connectToDatabase } from '@/lib/mongodb';
import { Popup } from '@/models/Popup';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ ok: false, error: 'Invalid popup id.' }, { status: 400 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
    }

    const parsed = popupUpdateSchema.parse(body);

    await connectToDatabase();
    const popup = await Popup.findByIdAndUpdate(
      id,
      {
        $set: {
          ...parsed,
          ...(('buttonText' in parsed) ? { buttonText: parsed.buttonText || undefined } : {}),
          ...(('buttonUrl' in parsed) ? { buttonUrl: parsed.buttonUrl || undefined } : {}),
        },
      },
      { new: true, runValidators: true },
    );

    if (!popup) {
      return NextResponse.json({ ok: false, error: 'Popup not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, popup }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: err.issues[0]?.message || 'Invalid popup data.' },
        { status: 400 },
      );
    }
    console.error('[admin/popups] failed to update popup:', err);
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ ok: false, error: 'Invalid popup id.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const popup = await Popup.findByIdAndDelete(id);

    if (!popup) {
      return NextResponse.json({ ok: false, error: 'Popup not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[admin/popups] failed to delete popup:', err);
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
