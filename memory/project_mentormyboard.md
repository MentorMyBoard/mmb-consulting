---
name: project-mentormyboard
description: MentorMyBoard production website — stack, structure, key decisions, and deployment notes
metadata:
  type: project
---

Full-stack Next.js 14 (App Router) website for MentorMyBoard (MMB) — a board governance and strategic advisory firm.

**Why:** Transform a Gemini-generated single-file frontend into a production-ready full-stack app without redesigning the UI.

**Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, MongoDB (Mongoose), Resend (emails), Sonner (toasts), Zod (validation), Upstash Redis (rate limiting), Cloudflare Turnstile (CAPTCHA, optional).

**Key architecture decisions:**
- Content lives in `/content/*.ts` (CMS-lite: services, founders, testimonials, site config) — update copy without touching components
- Email templates in `/emails/` use React Email + Resend  
- Admin submissions view at `/admin/submissions` protected by HTTP Basic Auth (middleware.ts)
- Rate limiting: Upstash Redis preferred; in-memory fallback for dev/no-Upstash
- Contact form: honeypot + Zod + DOMPurify sanitize + optional Turnstile
- Color system: Material Design 3 tokens mapped to CSS variables in globals.css; Tailwind references them via rgb() alpha-value pattern

**Deployment:** Vercel (vercel.json present; functions configured with maxDuration)

**How to apply:** When suggesting changes to copy, content, or data — point to `/content/*.ts`. For email changes — `/emails/`. For backend logic — `/app/api/` and `/lib/`. The frontend components should not need changes for content updates.
