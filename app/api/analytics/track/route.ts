/**
 * POST /api/analytics/track
 * Public, fire-and-forget endpoint the site pings for a page view and for a
 * promo popup click. Rate-limited per IP like the other public write routes.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { ZodError } from 'zod';
import { analyticsEventSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { connectToDatabase } from '@/lib/mongodb';
import { AnalyticsEvent } from '@/models/AnalyticsEvent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const parsed = analyticsEventSchema.parse(body);

    if (parsed.popupId && !isValidObjectId(parsed.popupId)) {
      return NextResponse.json({ ok: false, error: 'Invalid popup id.' }, { status: 400 });
    }

    const ip = getClientIp(req);
    const rl = await rateLimit(`analytics:${ip}`);
    if (!rl.success) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    await connectToDatabase();
    await AnalyticsEvent.create({
      type: parsed.type,
      popupId: parsed.popupId || undefined,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ ok: false, error: 'Invalid event.' }, { status: 400 });
    }
    console.error('[analytics] failed to record event:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
