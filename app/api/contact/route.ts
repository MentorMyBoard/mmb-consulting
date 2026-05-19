/**
 * POST /api/contact
 *
 * Pipeline:
 *   1. Parse JSON body
 *   2. Honeypot + Zod validation (early reject malformed/spam)
 *   3. Rate limit by client IP (Upstash → memory fallback)
 *   4. Optional Turnstile CAPTCHA verification
 *   5. Sanitize all text fields
 *   6. Persist to MongoDB
 *   7. Dispatch notification + confirmation emails in parallel
 *   8. Return reference ID
 *
 * Failures in step 7 do NOT roll back step 6 — the submission is recorded
 * even if email delivery momentarily fails; we just mark the flags accordingly.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { contactFormSchema } from '@/lib/validations';
import { sanitizeText, sanitizeMultiline } from '@/lib/sanitize';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { connectToDatabase } from '@/lib/mongodb';
import { Contact } from '@/models/Contact';
import { sendContactEmails } from '@/lib/email';

export const runtime = 'nodejs'; // Mongoose needs Node, not Edge
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    // 1. Parse JSON
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }

    // 2. Validate shape
    const parsed = contactFormSchema.parse(body);

    // 3. Honeypot
    if (parsed.website && parsed.website.length > 0) {
      // Silently 200 so bots don't probe for the trap
      return NextResponse.json({ ok: true, message: 'Thank you.' }, { status: 200 });
    }

    // 4. Rate limit
    const rl = await rateLimit(`contact:${ip}`);
    if (!rl.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Too many requests. Please try again in a few minutes.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rl.limit),
            'X-RateLimit-Remaining': String(rl.remaining),
          },
        },
      );
    }

    // 5. CAPTCHA (no-op if Turnstile not configured)
    const captchaOk = await verifyTurnstile(parsed.turnstileToken, ip);
    if (!captchaOk) {
      return NextResponse.json(
        { ok: false, error: 'CAPTCHA verification failed. Please refresh and try again.' },
        { status: 400 },
      );
    }

    // 6. Sanitize
    const clean = {
      name: sanitizeText(parsed.name),
      email: parsed.email, // Zod already lowercased & validated
      company: sanitizeText(parsed.company),
      phone: sanitizeText(parsed.phone),
      requirement: sanitizeText(parsed.requirement),
      message: sanitizeMultiline(parsed.message),
    };

    // 7. Persist (best-effort — DB failure must not block email dispatch)
    let submissionId: string | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let savedSubmission: any = null;
    try {
      await connectToDatabase();
      savedSubmission = await Contact.create({
        ...clean,
        ipAddress: ip,
        userAgent: req.headers.get('user-agent')?.slice(0, 500),
      });
      submissionId = savedSubmission._id.toString();
    } catch (dbErr) {
      console.error('[contact] DB save failed (non-fatal, proceeding with email):', dbErr);
    }

    // 8. Email — always runs regardless of DB status
    const emailResults = await sendContactEmails({
      id: submissionId ?? `ref-${Date.now()}`,
      ...clean,
      submittedAt: savedSubmission?.createdAt ?? new Date(),
    });

    // Best-effort: update email flags on the saved record if we have one
    if (savedSubmission) {
      savedSubmission.emailNotificationSent = emailResults.notification.ok;
      savedSubmission.emailConfirmationSent = emailResults.confirmation.ok;
      try {
        await savedSubmission.save();
      } catch (e) {
        console.error('[contact] flag update failed (non-fatal):', e);
      }
    }

    return NextResponse.json(
      {
        ok: true,
        message: "We've received your inquiry. A member of our advisory team will respond within one business day.",
        referenceId: submissionId ?? undefined,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of err.issues) {
        const key = issue.path.join('.') || 'form';
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return NextResponse.json(
        { ok: false, error: 'Please correct the highlighted fields.', fieldErrors },
        { status: 400 },
      );
    }

    console.error('[contact] unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 },
    );
  }
}

// Reject other methods explicitly so we don't leak the route's existence
export async function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
