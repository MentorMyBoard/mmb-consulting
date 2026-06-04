/**
 * Server-side input sanitization — no DOM library required.
 * Strips HTML tags via regex. Safe for plain-text form fields
 * (names, emails, phone, message) which are never rendered as raw HTML.
 * Zod validates format; MongoDB and React Email handle their own escaping.
 */

export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/\s+/g, ' ')      // collapse whitespace
    .trim();
}

export function sanitizeMultiline(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
