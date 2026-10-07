/**
 * POST /api/ipo-lead
 * Public — captures a lead from the "Go for IPO" page the moment a visitor
 * answers their first quiz question. Rate-limited like other public writes.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ipoLeadSchema } from '@/lib/validations';
import { sanitizeText } from '@/lib/sanitize';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { connectToDatabase } from '@/lib/mongodb';
import { IpoLead } from '@/models/IpoLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
    }

    const parsed = ipoLeadSchema.parse(body);

    const rl = await rateLimit(`ipo-lead:${ip}`);
    if (!rl.success) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again shortly.' },
        { status: 429 },
      );
    }

    await connectToDatabase();
    await IpoLead.create({
      name: sanitizeText(parsed.name),
      email: parsed.email,
      phone: sanitizeText(parsed.phone),
      company: parsed.company ? sanitizeText(parsed.company) : undefined,
      role: parsed.role ? sanitizeText(parsed.role) : undefined,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: err.issues[0]?.message || 'Please check the form and try again.' },
        { status: 400 },
      );
    }
    console.error('[ipo-lead] failed to save lead:', err);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
