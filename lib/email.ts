/**
 * Email service — Brevo (formerly Sendinblue) transactional email.
 *
 * Uses Brevo's REST API directly via fetch — no SDK dependency.
 * Two emails on every contact submission:
 *   1. Notification to the business inbox
 *   2. Confirmation to the submitter
 */
import { render } from '@react-email/components';
import ContactNotification from '../emails/ContactNotification';
import ContactConfirmation from '../emails/ContactConfirmation';
import { siteConfig } from '../content/site';

const BREVO_API_KEY   = process.env.BREVO_API_KEY;
const EMAIL_FROM      = process.env.EMAIL_FROM || 'MentorMyBoard <no-reply@mentormyboard.com>';
const EMAIL_TO_BIZ    = process.env.EMAIL_TO_BUSINESS || siteConfig.contact.email;
const EMAIL_CC        = process.env.EMAIL_CC_INTERNAL;

if (!BREVO_API_KEY) {
  console.warn('[email] BREVO_API_KEY is not set — emails will be logged to console, not sent.');
}

/** Parse "Name <email>" or plain "email" into { name, email } */
function parseSender(raw: string): { name: string; email: string } {
  const m = raw.match(/^(.+?)\s*<(.+?)>$/);
  return m ? { name: m[1].trim(), email: m[2].trim() } : { name: raw, email: raw };
}

type SendParams = {
  to: string;
  toName?: string;
  replyTo?: string;
  cc?: string;
  subject: string;
  html: string;
  refId?: string;
};

async function sendBrevoEmail(p: SendParams): Promise<{ ok: boolean; error?: string }> {
  if (!BREVO_API_KEY) return { ok: true }; // dev fallback — already logged above

  const sender = parseSender(EMAIL_FROM);

  const body: Record<string, unknown> = {
    sender,
    to:      [{ email: p.to, name: p.toName ?? p.to }],
    subject: p.subject,
    htmlContent: p.html,
  };

  if (p.replyTo) body.replyTo = { email: p.replyTo };
  if (p.cc)      body.cc      = [{ email: p.cc }];
  if (p.refId)   body.headers = { 'X-Entity-Ref-ID': p.refId };

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Brevo ${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export type ContactPayload = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  requirement: string;
  message: string;
  submittedAt: Date;
};

export async function sendContactEmails(payload: ContactPayload): Promise<{
  notification: { ok: boolean; error?: string };
  confirmation: { ok: boolean; error?: string };
}> {
  const [notificationHtml, confirmationHtml] = await Promise.all([
    render(ContactNotification({ ...payload })),
    render(ContactConfirmation({ name: payload.name, requirement: payload.requirement })),
  ]);

  // Dev mode — no API key
  if (!BREVO_API_KEY) {
    console.log('\n--- [DEV EMAIL] Business notification ---');
    console.log({ to: EMAIL_TO_BIZ, subject: `New Inquiry — ${payload.requirement} — ${payload.name}`, payload });
    console.log('--- [DEV EMAIL] User confirmation ---');
    console.log({ to: payload.email, subject: `We've received your inquiry — ${siteConfig.name}` });
    return { notification: { ok: true }, confirmation: { ok: true } };
  }

  const [notificationResult, confirmationResult] = await Promise.allSettled([
    sendBrevoEmail({
      to:      EMAIL_TO_BIZ,
      toName:  'MentorMyBoard Team',
      replyTo: payload.email,
      cc:      EMAIL_CC,
      subject: `New Inquiry — ${payload.requirement} — ${payload.name}`,
      html:    notificationHtml,
      refId:   payload.id,
    }),
    sendBrevoEmail({
      to:      payload.email,
      toName:  payload.name,
      subject: `We've received your inquiry — ${siteConfig.name}`,
      html:    confirmationHtml,
      refId:   payload.id,
    }),
  ]);

  const notification = notificationResult.status === 'fulfilled'
    ? notificationResult.value
    : { ok: false, error: String(notificationResult.reason) };

  const confirmation = confirmationResult.status === 'fulfilled'
    ? confirmationResult.value
    : { ok: false, error: String(confirmationResult.reason) };

  if (!notification.ok) console.error('[email] business notification failed:', notification.error);
  if (!confirmation.ok) console.error('[email] user confirmation failed:', confirmation.error);

  return { notification, confirmation };
}
