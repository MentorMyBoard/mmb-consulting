'use client';

import { motion } from 'framer-motion';
import { partners } from '@/content/partners';

const track = [...partners, ...partners];

export default function Partners() {
  if (partners.length === 0) return null;

  return (
    <section className="py-20 px-8 md:px-16 bg-surface border-y border-outline-variant overflow-hidden">
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant font-semibold">
          Our Partners &amp; Associations
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-surface to-transparent" />

        <motion.div
          className="flex gap-16 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: partners.length * 4,
            ease: 'linear',
            repeat: Infinity,
          }}
          style={{ width: `${track.length * 180}px` }}
        >
          {track.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="flex-shrink-0 w-36 h-16 flex items-center justify-center opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
