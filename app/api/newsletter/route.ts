/**
 * POST /api/newsletter
 * Lightweight email-only subscription endpoint. Idempotent — re-subscribing
 * silently succeeds. Honors the honeypot field and rate limits per IP.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { newsletterSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { connectToDatabase } from '@/lib/mongodb';
import { Newsletter } from '@/models/Newsletter';
import { pushNewsletterToZoho } from '@/lib/zoho';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
    }

    const parsed = newsletterSchema.parse(body);

    if (parsed.website && parsed.website.length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const rl = await rateLimit(`newsletter:${ip}`);
    if (!rl.success) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again shortly.' },
        { status: 429 },
      );
    }

    await connectToDatabase();
    await Newsletter.findOneAndUpdate(
      { email: parsed.email },
      { $set: { unsubscribed: false }, $setOnInsert: { source: 'website-footer' } },
      { upsert: true, new: true },
    );

    // Awaited so Vercel doesn't terminate before the Zoho request completes
    try {
      await pushNewsletterToZoho(parsed.email);
    } catch (e) {
      console.error('[newsletter] Zoho push error:', e);
    }

    return NextResponse.json(
      { ok: true, message: "You're subscribed. Welcome aboard." },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: err.issues[0]?.message || 'Invalid email.' },
        { status: 400 },
      );
    }
    console.error('[newsletter] error:', err);
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
