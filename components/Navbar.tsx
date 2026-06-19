'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/content/site';
import { Logo } from '@/components/Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function closeMenu() { setMenuOpen(false); }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-primary/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-lg'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="flex justify-between items-center w-full px-8 md:px-16 max-w-7xl mx-auto">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8 items-center" aria-label="Primary">
            {siteConfig.navigation.map((item) =>
              item.label === 'Explore MMB' ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm uppercase tracking-[0.15em] text-secondary hover:text-white relative group transition-colors duration-300 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">grid_view</span>
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-secondary transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm uppercase tracking-[0.15em] text-primary-fixed-dim hover:text-secondary relative group transition-colors duration-300"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-secondary transition-all duration-300 group-hover:w-full" />
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden md:inline-block px-6 md:px-8 py-3 text-xs md:text-sm uppercase tracking-[0.15em] bg-secondary text-primary font-semibold hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Inquire
            </a>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 text-on-primary transition-colors duration-300"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-primary flex flex-col justify-center px-10 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div
              className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] opacity-[0.04] mix-blend-overlay pointer-events-none"
              aria-hidden="true"
            />

            <nav className="relative space-y-2" aria-label="Mobile primary">
              {siteConfig.navigation.map((item, idx) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07 + 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`block font-serif text-4xl transition-colors duration-300 py-3 ${
                    item.label === 'Explore MMB'
                      ? 'text-secondary hover:text-white flex items-center gap-3'
                      : 'text-on-primary hover:text-secondary'
                  }`}
                >
                  {item.label === 'Explore MMB' && (
                    <span className="material-symbols-outlined text-3xl" aria-hidden="true">grid_view</span>
                  )}
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="relative mt-12 border-t border-secondary/20 pt-10 space-y-4"
            >
              <a
                href="#contact"
                onClick={closeMenu}
                className="inline-block bg-secondary text-primary px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-white transition-all duration-300"
              >
                Inquire Now
              </a>
              <p className="text-primary-fixed-dim text-sm font-light">{siteConfig.contact.email}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
