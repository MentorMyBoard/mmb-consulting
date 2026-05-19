/**
 * Zod schemas — used identically on client and server.
 * Client uses them for instant feedback; server uses them as a security gate.
 * Never trust the client-side validation alone.
 */
import { z } from 'zod';

/** Phone — permissive but bounded. Accepts +, digits, spaces, dashes, parens. */
const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;

/** Honeypot — must remain empty. Bots tend to fill every field. */
const honeypotSchema = z
  .string()
  .max(0, 'Spam detected')
  .optional()
  .or(z.literal(''));

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[\p{L}\s.'-]+$/u, 'Name contains invalid characters'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .max(254, 'Email is too long'),

  company: z
    .string()
    .trim()
    .min(1, 'Organization is required')
    .max(200, 'Organization name is too long'),

  phone: z
    .string()
    .trim()
    .max(20, 'Phone number is too long')
    .refine(
      (val) => val.length === 0 || phoneRegex.test(val),
      'Please enter a valid phone number'
    ),

  requirement: z
    .string()
    .trim()
    .min(1, 'Please select a requirement')
    .max(100),

  message: z
    .string()
    .trim()
    .min(10, 'Please share at least a few sentences about your needs')
    .max(5000, 'Message is too long'),

  /** Cloudflare Turnstile token — optional in dev, validated server-side when present. */
  turnstileToken: z.string().optional(),

  /** Honeypot field — must stay empty. */
  website: honeypotSchema,
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  website: honeypotSchema,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
