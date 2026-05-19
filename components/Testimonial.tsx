'use client';

import { motion } from 'framer-motion';
import { testimonials } from '@/content/testimonials';

export default function Testimonial() {
  const t = testimonials[0];
  if (!t) return null;

  return (
    <section className="py-32 px-8 bg-primary text-on-primary relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] opacity-5 mix-blend-overlay" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <span className="material-symbols-outlined text-6xl text-secondary mb-10 block opacity-50" aria-hidden="true">
          format_quote
        </span>
        <blockquote className="font-serif text-3xl md:text-5xl leading-tight mb-12 font-light">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <div className="flex flex-col items-center">
          <div className="w-16 h-px bg-secondary mb-6" />
          <cite className="text-xs uppercase tracking-[0.2em] text-primary-fixed-dim not-italic">
            {t.attribution}
            {t.organization && `, ${t.organization}`}
          </cite>
        </div>
      </motion.div>
    </section>
  );
}
