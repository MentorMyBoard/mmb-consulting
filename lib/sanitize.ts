/**
 * Server-safe input sanitization.
 * DOMPurify is run via the isomorphic shim so it works in Node API routes.
 *
 * We strip *all* HTML — these fields are plain-text inputs.
 * If you ever allow rich-text input, switch to ALLOWED_TAGS instead.
 */
import DOMPurify from 'isomorphic-dompurify';
import type { Config } from 'dompurify';

const PURIFY_CONFIG: Config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  // Strip HTML, normalize whitespace, trim.
  const cleaned = DOMPurify.sanitize(input, PURIFY_CONFIG) as unknown as string;
  return cleaned.replace(/\s+/g, ' ').trim();
}

export function sanitizeMultiline(input: string): string {
  if (typeof input !== 'string') return '';
  const cleaned = DOMPurify.sanitize(input, PURIFY_CONFIG) as unknown as string;
  // Preserve paragraph breaks; collapse runs of spaces; trim each line.
  return cleaned
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * HTML-escape a string for safe inclusion inside an HTML email body.
 * Use this on every user-supplied value rendered into an HTML email
 * template that isn't already React-escaped.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
