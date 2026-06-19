'use client';

import { motion } from 'framer-motion';
import { fadeInUp, slideInLeft } from '@/lib/animations';
import { founders } from '@/content/founders';

export default function Leadership() {
  return (
    <section id="leadership" className="py-32 px-8 md:px-16 bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="font-serif text-4xl md:text-5xl text-primary text-center mb-24"
        >
          Our Founders
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-20">
          {founders.map((founder, idx) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, x: idx === 0 ? -70 : 70, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
              className="flex flex-col gap-8 group"
            >
              <div className="overflow-hidden rounded-t-full border-b-4 border-secondary/0 group-hover:border-secondary transition-all duration-700 w-full max-w-[350px] mx-auto md:mx-0 aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`Portrait of ${founder.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  src={founder.imageUrl}
                  loading="lazy"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-serif text-3xl text-primary mb-2">{founder.name}</h3>
                <p className="text-xs uppercase tracking-widest text-secondary mb-6 font-semibold">
                  {founder.title} ({founder.years})
                </p>
                <p className="text-on-surface-variant font-serif italic mb-4 text-lg">{founder.tagline}</p>
                <p className="text-on-surface-variant font-light leading-relaxed">{founder.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
