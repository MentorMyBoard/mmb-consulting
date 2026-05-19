# MentorMyBoard — Production Website

A premium, production-ready full-stack website for **MentorMyBoard (MMB)** — a board advisory, governance, investment banking, and legal/compliance consultancy.

Built with **Next.js 14 (App Router)**, **TypeScript**, **MongoDB**, **Resend**, **Tailwind CSS**, and **Framer Motion**.

---

## Highlights

- **Pixel-preserved frontend** — every animation, transition, and visual decision from the original design is intact, refactored into modular components.
- **Working contact form** — Zod validation, sanitization, rate limiting, honeypot, optional Turnstile CAPTCHA, MongoDB persistence, dual transactional emails (business + user).
- **Premium email templates** — React Email + Resend, branded to match the site.
- **CMS-lite architecture** — services, founders, testimonials, navigation, and stats all live in `/content/*.ts` so the team can edit copy without touching components.
- **Admin dashboard** — Basic-auth-protected `/admin/submissions` view to retrieve and triage inquiries.
- **SEO-ready** — metadata, OG tags, JSON-LD structured data, dynamic sitemap, robots.txt.
- **Production-grade security** — input sanitization (DOMPurify), rate limiting (Upstash with in-memory fallback), security headers, hidden `X-Powered-By`, no PII in logs.
- **Accessibility** — focus rings, ARIA labels, `prefers-reduced-motion` respected, semantic HTML.
- **Mobile-first** — full hamburger navigation on mobile with smooth slide-in panel.
- **Performance** — lazy-loaded heavy components, optimized fonts (`next/font`), preconnect hints, image format negotiation (AVIF/WebP).

---

## Project Structure

```
mentormyboard/
├── app/
│   ├── layout.tsx                    # Root layout — metadata, fonts, providers
│   ├── page.tsx                      # Home page composition
│   ├── globals.css                   # Design tokens + base styles
│   ├── sitemap.ts                    # Dynamic sitemap.xml
│   ├── robots.ts                     # Dynamic robots.txt
│   ├── not-found.tsx                 # Custom 404
│   ├── admin/
│   │   └── submissions/page.tsx      # Protected admin view
│   └── api/
│       ├── contact/route.ts          # Contact form endpoint
│       └── newsletter/route.ts       # Newsletter signup endpoint
│
├── components/
│   ├── ui/
│   │   └── Button.tsx                # Reusable button (primary/secondary/ghost)
│   ├── Navbar.tsx                    # Fixed nav + mobile hamburger slide-in
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Services.tsx                  # Bento grid of service cards
│   ├── Leadership.tsx                # Founder profiles
│   ├── Testimonial.tsx
│   ├── Advisory.tsx                  # Advisory mandate process + focus areas
│   ├── Contact.tsx                   # Contact info + ContactForm
│   ├── ContactForm.tsx               # Interactive form (Zod + toast)
│   ├── Footer.tsx                    # Includes newsletter signup
│   ├── WhatsAppButton.tsx            # Floating WA action
│   ├── LoadingScreen.tsx
│   ├── ScrollProgress.tsx
│   └── SmoothScroll.tsx              # Lenis wrapper
│
├── content/                          # CMS-lite — edit these to change copy
│   ├── site.ts                       # Brand, nav, contact info, WhatsApp
│   ├── services.ts                   # Services bento grid data
│   ├── founders.ts                   # Leadership profiles
│   └── testimonials.ts               # Quotes + stats + form dropdown options
│
├── lib/
│   ├── mongodb.ts                    # Connection pool helper
│   ├── email.ts                      # Resend dispatcher
│   ├── validations.ts                # Zod schemas (client + server share these)
│   ├── sanitize.ts                   # DOMPurify wrappers
│   ├── rate-limit.ts                 # Upstash + in-memory fallback
│   ├── turnstile.ts                  # CAPTCHA verification (optional)
│   └── animations.ts                 # Shared Framer Motion variants
│
├── models/
│   ├── Contact.ts                    # Contact submission Mongoose schema
│   └── Newsletter.ts                 # Newsletter subscriber schema
│
├── emails/
│   ├── ContactNotification.tsx       # Branded internal notification email
│   └── ContactConfirmation.tsx       # Branded user confirmation email
│
├── types/
│   └── index.ts                      # Shared TypeScript types
│
├── public/
│   └── favicon.svg                   # SVG favicon (replace with .ico for IE11)
│
├── middleware.ts                     # Basic Auth for /admin/*
├── next.config.js                    # Image domains + security headers
├── tailwind.config.ts                # Design tokens (MD3 color system)
├── vercel.json                       # Function timeouts + X-Robots headers
├── .env.example                      # Copy to .env.local and fill in values
└── tsconfig.json
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | No | Defaults to `mentormyboard` |
| `RESEND_API_KEY` | Yes (prod) | From resend.com — dev logs emails to console |
| `EMAIL_FROM` | Yes (prod) | Verified Resend sender address |
| `EMAIL_TO_BUSINESS` | Yes | Inbox that receives inquiries |
| `EMAIL_CC_INTERNAL` | No | Optional CC |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Yes | E.164 without `+` e.g. `919876543210` |
| `ADMIN_USERNAME` | Yes | Protects `/admin/submissions` |
| `ADMIN_PASSWORD` | Yes | Use a strong password |
| `UPSTASH_REDIS_REST_URL` | No | Falls back to in-memory rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | No | Pair with URL |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile widget key |
| `TURNSTILE_SECRET_KEY` | No | Pair with site key |
| `NEXT_PUBLIC_SITE_URL` | No | Defaults to `https://mentormyboard.com` |

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
npm start
```

### 5. Type check

```bash
npm run type-check
```

---

## Deploying to Vercel

1. Push the repository to GitHub / GitLab.
2. Import project in [vercel.com/new](https://vercel.com/new).
3. Set all environment variables in **Project Settings → Environment Variables**.
4. Deploy — Vercel detects Next.js automatically.

> The `vercel.json` in the root pre-configures function timeouts and robots headers. No extra Vercel settings needed.

---

## Updating Content (no code changes needed)

| What to change | File |
|---|---|
| Site name, tagline, contact email, WhatsApp number | `content/site.ts` |
| Navigation links | `content/site.ts` → `navigation` array |
| Footer links | `content/site.ts` → `footer` |
| Services (title, bullets, icon) | `content/services.ts` |
| Founder bios, photos, LinkedIn | `content/founders.ts` |
| Testimonial quote | `content/testimonials.ts` → `testimonials` array |
| Hero stats (₹18,000 Cr, 3+ Decades…) | `content/testimonials.ts` → `heroStats` |
| Contact form dropdown options | `content/testimonials.ts` → `requirements` |

---

## Admin — Viewing Submissions

Visit `/admin/submissions`. Your browser will prompt for credentials (set in `ADMIN_USERNAME` / `ADMIN_PASSWORD`).

The page shows the latest 100 inquiries sorted newest-first, with submission status, email delivery flags, and full message text.

---

## Email Setup (Resend)

1. Create a free account at [resend.com](https://resend.com).
2. Add and verify your domain (e.g. `mentormyboard.com`).
3. Create an API key and set `RESEND_API_KEY`.
4. Set `EMAIL_FROM` to a verified sender like `no-reply@mentormyboard.com`.
5. Set `EMAIL_TO_BUSINESS` to the inbox that receives inquiries.

Without `RESEND_API_KEY`, the app runs normally but emails are logged to the console (useful in dev).

---

## OG Image

Add a `og-image.jpg` (1200×630 px) to the `/public` directory. Recommended design:
- Background: `#0C183A` (deep navy)
- Wordmark: "MentorMyBoard" in white serif
- Tagline: "Strategic Governance Excellence" in gold (`#C6A15B`)

Alternatively, use `@vercel/og` to generate it dynamically — see [vercel.com/docs/functions/og-image-generation](https://vercel.com/docs/functions/og-image-generation).

---

## Security Notes

- All form inputs are validated with Zod **and** sanitized with DOMPurify before touching the database.
- Rate limiting prevents brute-force and spam — 5 submissions per IP per 10 minutes.
- The honeypot field silently discards bot submissions.
- `/admin/*` is protected by HTTP Basic Auth enforced in middleware (Edge runtime).
- Security headers (`HSTS`, `X-Frame-Options`, `X-Content-Type-Options`, etc.) are set in `next.config.js`.
- No user PII is logged; IP addresses are stored only in the database for abuse tracking.

---

## License

Private — all rights reserved © MentorMyBoard.
