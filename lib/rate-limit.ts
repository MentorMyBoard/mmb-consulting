/**
 * Rate limiting for API endpoints.
 *
 * Preferred backend: Upstash Redis (works on serverless / Vercel).
 * Fallback: in-memory sliding window (single-instance only — fine for dev).
 *
 * Public API: `await rateLimit(identifier, options)`.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // ms epoch
};

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let upstashLimiter: Ratelimit | null = null;

if (UPSTASH_URL && UPSTASH_TOKEN) {
  const redis = new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN });
  upstashLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '10 m'), // 5 requests per 10 minutes per IP
    analytics: true,
    prefix: 'mmb:contact',
  });
}

// ---- In-memory fallback ----
type Bucket = { count: number; resetAt: number };
const memoryStore = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

function memoryRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const bucket = memoryStore.get(identifier);

  if (!bucket || bucket.resetAt < now) {
    memoryStore.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS - 1, reset: now + WINDOW_MS };
  }

  bucket.count += 1;
  const remaining = Math.max(0, MAX_REQUESTS - bucket.count);
  return {
    success: bucket.count <= MAX_REQUESTS,
    limit: MAX_REQUESTS,
    remaining,
    reset: bucket.resetAt,
  };
}

// Cleanup expired in-memory buckets every 5 minutes to avoid leaks.
if (typeof setInterval !== 'undefined' && !upstashLimiter) {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of memoryStore.entries()) {
      if (v.resetAt < now) memoryStore.delete(k);
    }
  }, 5 * 60 * 1000).unref?.();
}

export async function rateLimit(identifier: string): Promise<RateLimitResult> {
  if (upstashLimiter) {
    const r = await upstashLimiter.limit(identifier);
    return {
      success: r.success,
      limit: r.limit,
      remaining: r.remaining,
      reset: r.reset,
    };
  }
  return memoryRateLimit(identifier);
}

/** Extract client IP from a Next.js request — works behind Vercel proxy. */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'anonymous';
}
