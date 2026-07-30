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

export const popupPositions = [
  'left-top',
  'left-bottom',
  'right-top',
  'right-bottom',
  'center-top',
  'center-bottom',
] as const;

/** data:image/<type>;base64,<payload> — produced by client-side canvas compression. */
const imageDataUriRegex = /^data:image\/(png|jpeg|jpg|webp);base64,/;

/** ~2MB of base64 — comfortably under MongoDB's 16MB document cap. */
const MAX_IMAGE_DATA_LENGTH = 2_800_000;

const popupBaseSchema = z.object({
  label: z.string().trim().min(1, 'Internal label is required').max(100, 'Label is too long'),

  orientation: z.enum(['portrait', 'landscape'], {
    errorMap: () => ({ message: 'Select an image orientation' }),
  }),

  width: z.coerce
    .number({ invalid_type_error: 'Width is required' })
    .int('Width must be a whole number')
    .min(50, 'Width must be at least 50px')
    .max(1600, 'Width must be 1600px or less'),

  height: z.coerce
    .number({ invalid_type_error: 'Height is required' })
    .int('Height must be a whole number')
    .min(50, 'Height must be at least 50px')
    .max(1600, 'Height must be 1600px or less'),

  position: z.enum(popupPositions, {
    errorMap: () => ({ message: 'Select where the popup appears on screen' }),
  }),

  buttonText: z.string().trim().max(50, 'Button text is too long').optional().or(z.literal('')),
  buttonUrl: z.string().trim().max(500, 'Button URL is too long').optional().or(z.literal('')),

  active: z.boolean().default(true),
});

function checkButtonAndUrl(
  data: { buttonText?: string; buttonUrl?: string },
  ctx: z.RefinementCtx,
) {
  const hasText = !!data.buttonText;
  const hasUrl = !!data.buttonUrl;

  if (hasText !== hasUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Button text and button URL must both be set, or both left empty',
      path: ['buttonUrl'],
    });
  }

  if (hasUrl && !/^https?:\/\//i.test(data.buttonUrl!)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Button URL must start with http:// or https://',
      path: ['buttonUrl'],
    });
  }
}

export const popupCreateSchema = popupBaseSchema
  .extend({
    imageData: z
      .string()
      .min(1, 'Please upload an image')
      .regex(imageDataUriRegex, 'Invalid image format')
      .refine(
        (val) => val.length <= MAX_IMAGE_DATA_LENGTH,
        'Image is too large even after compression — please use a smaller image',
      ),
  })
  .superRefine(checkButtonAndUrl);

export const popupUpdateSchema = popupBaseSchema
  .partial()
  .extend({
    imageData: z
      .string()
      .regex(imageDataUriRegex, 'Invalid image format')
      .refine(
        (val) => val.length <= MAX_IMAGE_DATA_LENGTH,
        'Image is too large even after compression — please use a smaller image',
      )
      .optional(),
  })
  .superRefine(checkButtonAndUrl);

export type PopupCreateInput = z.infer<typeof popupCreateSchema>;
export type PopupUpdateInput = z.infer<typeof popupUpdateSchema>;

export const analyticsEventSchema = z.object({
  type: z.enum(['page_view', 'popup_click']),
  popupId: z.string().optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
