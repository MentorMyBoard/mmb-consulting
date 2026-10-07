/**
 * /api/admin/ipo-settings
 * Protected by proxy.ts Basic Auth (matcher includes /api/admin/:path*).
 *
 * GET — current Consult Now URL.
 * PUT — update it.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ipoSettingsSchema } from '@/lib/validations';
import { connectToDatabase } from '@/lib/mongodb';
import { IpoSettings, IPO_SETTINGS_ID } from '@/models/IpoSettings';
import { errorDetail } from '@/lib/errors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const doc = await IpoSettings.findById(IPO_SETTINGS_ID).lean();
    return NextResponse.json({ ok: true, consultNowUrl: doc?.consultNowUrl ?? '' }, { status: 200 });
  } catch (err) {
    console.error('[admin/ipo-settings] failed to load:', err);
    return NextResponse.json(
      { ok: false, error: `Failed to load settings: ${errorDetail(err)}` },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
    }

    const parsed = ipoSettingsSchema.parse(body);

    await connectToDatabase();
    const doc = await IpoSettings.findByIdAndUpdate(
      IPO_SETTINGS_ID,
      { $set: { consultNowUrl: parsed.consultNowUrl } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({ ok: true, consultNowUrl: doc.consultNowUrl }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: err.issues[0]?.message || 'Invalid URL.' },
        { status: 400 },
      );
    }
    console.error('[admin/ipo-settings] failed to update:', err);
    return NextResponse.json(
      { ok: false, error: `Something went wrong: ${errorDetail(err)}` },
      { status: 500 },
    );
  }
}
