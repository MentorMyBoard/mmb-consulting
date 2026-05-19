'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '@/content/testimonials';

const INTERVAL_MS = 10_000;

export default function Testimonial() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const advance = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => advance(1), INTERVAL_MS);
    return () => clearInterval(id);
  }, [advance]);

  const t = testimonials[index];
  if (!t) return null;

  return (
    <section className="py-32 px-8 bg-primary text-on-primary relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] opacity-5 mix-blend-overlay" />

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={t.id}
          custom={direction}
          variants={{
            enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
            center: { opacity: 1, x: 0 },
            exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center relative z-10 px-4"
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
      </AnimatePresence>

      {testimonials.length > 1 && (
        <div className="relative z-10 flex items-center gap-6 mt-12">
          <button
            onClick={() => advance(-1)}
            aria-label="Previous testimonial"
            className="w-10 h-10 border border-on-primary/30 flex items-center justify-center hover:border-secondary hover:text-secondary transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">chevron_left</span>
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-px transition-all duration-500 ${i === index ? 'w-8 bg-secondary' : 'w-4 bg-on-primary/30 hover:bg-on-primary/60'}`}
              />
            ))}
          </div>

          <button
            onClick={() => advance(1)}
            aria-label="Next testimonial"
            className="w-10 h-10 border border-on-primary/30 flex items-center justify-center hover:border-secondary hover:text-secondary transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">chevron_right</span>
          </button>
        </div>
      )}
    </section>
  );
}
