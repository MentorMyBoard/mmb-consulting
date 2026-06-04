export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, string> = {};

  // Test each import the contact route depends on
  const tests = [
    ['zod', () => { require('zod'); }],
    ['isomorphic-dompurify', () => { const d = require('isomorphic-dompurify'); d.sanitize('test'); }],
    ['@react-email/components (render)', async () => {
      const { render } = await import('@react-email/components');
      const React = await import('react');
      const el = React.createElement('div', null, 'test');
      await render(el);
    }],
    ['mongoose', () => { require('mongoose'); }],
    ['@upstash/ratelimit', () => { require('@upstash/ratelimit'); }],
  ] as [string, () => unknown][];

  for (const [name, fn] of tests) {
    try {
      await fn();
      results[name] = 'OK';
    } catch (e) {
      results[name] = e instanceof Error ? e.message : String(e);
    }
  }

  return Response.json({ ok: true, results });
}
