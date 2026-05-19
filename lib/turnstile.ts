/**
 * Cloudflare Turnstile (free, privacy-friendly CAPTCHA) verification.
 *
 * If TURNSTILE_SECRET_KEY is not set, verification is bypassed — useful
 * for local dev. In production, set both keys to enforce it.
 */
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true; // dev / disabled
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret: TURNSTILE_SECRET, response: token });
    if (ip) body.append('remoteip', ip);

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // CDN-cacheable result; we don't want caching here.
      cache: 'no-store',
    });

    const data = (await res.json()) as { success: boolean };
    return Boolean(data.success);
  } catch (err) {
    console.error('[turnstile] verification failed:', err);
    return false;
  }
}
