/**
 * Shared TypeScript types used across components and API routes.
 * Keep this file free of runtime imports — types only.
 */

/** Generic API response shape returned by all /api/* routes. */
export type ApiResponse<T = undefined> =
  | { ok: true; message: string; data?: T; referenceId?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Contact submission status workflow. */
export type ContactStatus = 'new' | 'in_review' | 'responded' | 'closed' | 'spam';

/** Serialised contact submission as returned to the admin view. */
export type ContactSubmission = {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  requirement: string;
  message: string;
  status: ContactStatus;
  emailNotificationSent: boolean;
  emailConfirmationSent: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
};

/** Newsletter subscriber record. */
export type NewsletterSubscriber = {
  _id: string;
  email: string;
  source?: string;
  unsubscribed: boolean;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt: string;
};

/** Navigation link item. */
export type NavItem = {
  label: string;
  href: string;
};

/** Hero statistic entry. */
export type HeroStat = {
  value: string;
  label: string;
};

/** Service card data. */
export type Service = {
  id: string;
  title: string;
  icon: string;
  bullets: string[];
  href?: string;
};

/** Founder profile. */
export type Founder = {
  id: string;
  name: string;
  title: string;
  years: string;
  tagline: string;
  bio: string;
  imageUrl: string;
  linkedin?: string;
};

/** Testimonial / quote. */
export type Testimonial = {
  id: string;
  quote: string;
  attribution: string;
  organization?: string;
};
