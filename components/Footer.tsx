'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { siteConfig } from '@/content/site';
import { Logo } from '@/components/Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  async function subscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || !email) return;
    setBusy(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: '' }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Unable to subscribe right now.');
      } else {
        toast.success(data.message || "You're subscribed.");
        setEmail('');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <footer className="bg-primary text-primary-fixed-dim border-t border-primary/20 pt-20 pb-10">
      <div className="px-8 md:px-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 font-light">
        <div className="md:col-span-4">
          <div className="mb-6">
            <Logo />
          </div>
          <p className="mb-8 max-w-xs">{siteConfig.tagline} for the modern global enterprise.</p>

          {/* Newsletter */}
          <form onSubmit={subscribe} className="mb-8 max-w-sm">
            <label htmlFor="footer-email" className="block text-xs uppercase tracking-[0.2em] text-secondary font-semibold mb-3">
              Strategic Brief — Quarterly
            </label>
            <div className="flex gap-0 border-b border-primary-fixed-dim/30 focus-within:border-secondary transition-colors">
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="bg-transparent flex-1 py-3 outline-none text-on-primary placeholder:text-primary-fixed-dim/60 text-sm"
              />
              <button
                type="submit"
                disabled={busy}
                className="text-xs uppercase tracking-[0.15em] text-secondary hover:text-on-primary disabled:opacity-50 transition-colors px-4"
              >
                {busy ? '...' : 'Subscribe'}
              </button>
            </div>
          </form>

          <div className="flex gap-4">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-12 h-12 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-300"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </a>
            <a
              href={siteConfig.url}
              aria-label="Website"
              className="w-12 h-12 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-300"
            >
              <span className="material-symbols-outlined text-xl">public</span>
            </a>
          </div>
        </div>

        <div className="md:col-span-3 md:col-start-6">
          <h5 className="text-xs uppercase tracking-[0.2em] mb-8 text-secondary font-semibold">Services</h5>
          <ul className="space-y-4">
            {siteConfig.footer.services.map((item) => (
              <li key={item.label}>
                <a className="hover:text-on-primary transition-colors link-underline" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h5 className="text-xs uppercase tracking-[0.2em] mb-8 text-secondary font-semibold">Company &amp; Legal</h5>
          <ul className="space-y-4 grid grid-cols-2">
            {siteConfig.footer.company.map((item) => (
              <li key={item.label}>
                <a className="hover:text-on-primary transition-colors link-underline" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-fixed-dim/20 pt-8 text-center px-8">
        <p className="text-xs uppercase tracking-widest">
          © {siteConfig.copyrightYear} {siteConfig.name}. {siteConfig.tagline}.
        </p>
      </div>
    </footer>
  );
}
