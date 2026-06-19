'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, slideInLeft } from '@/lib/animations';
import { advisoryBoard } from '@/content/founders';

export default function AdvisoryBoard() {
  return (
    <section id="advisory-board" className="py-24 px-8 md:px-16 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInLeft}
          className="mb-16 border-l-4 border-secondary pl-8"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Advisory Board</h2>
          <p className="text-xl text-on-surface-variant font-light">
            Distinguished leaders guiding our strategic vision.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {advisoryBoard.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeInUp}
              className="group flex gap-5 p-6 border border-outline-variant bg-white hover:border-secondary/50 hover:shadow-xl transition-all duration-500"
            >
              <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-full border-2 border-outline-variant group-hover:border-secondary transition-colors duration-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.imageUrl}
                  alt={`Portrait of ${member.name}`}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-lg text-primary mb-1 leading-snug">{member.name}</h3>
                <p className="text-xs text-on-surface-variant font-light leading-snug mb-3">{member.title}</p>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-px bg-secondary flex-shrink-0" />
                  <p className="text-xs uppercase tracking-widest text-secondary font-semibold">{member.expertise}</p>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 font-light">{member.years}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
