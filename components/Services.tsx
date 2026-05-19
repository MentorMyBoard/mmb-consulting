'use client';

import { motion } from 'framer-motion';
import { services } from '@/content/services';

export default function Services() {
  return (
    <section id="services" className="py-32 px-8 md:px-16 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 border-l-4 border-secondary pl-8"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Strategic Consultancy Services</h2>
          <p className="text-xl text-on-surface-variant font-light">Navigating the corporate landscape with precision.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const isPremium = idx === 1;
            return (
              <motion.div
                key={service.id}
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={{
                  rest: { y: 0, boxShadow: isPremium ? '0 20px 60px rgba(12,24,58,0.3)' : '0 2px 12px rgba(0,0,0,0.06)' },
                  hover: { y: -12, boxShadow: isPremium ? '0 32px 80px rgba(12,24,58,0.45)' : '0 24px 64px rgba(249,159,27,0.18)', transition: { duration: 0.35, ease: [0.16,1,0.3,1] } },
                }}
                className={
                  isPremium
                    ? 'bg-primary text-on-primary border border-primary p-10 flex flex-col group relative overflow-hidden transition-colors duration-500 md:-translate-y-4 cursor-default'
                    : 'bg-white border border-outline-variant p-10 flex flex-col group relative overflow-hidden transition-colors duration-500 hover:border-secondary/50 cursor-default'
                }
              >
                {isPremium ? (
                  <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] opacity-10 mix-blend-overlay" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}

                <div
                  className={
                    isPremium
                      ? 'w-16 h-16 bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 rounded-full border border-white/20'
                      : 'w-16 h-16 bg-surface-container flex items-center justify-center mb-8 rounded-full group-hover:bg-secondary/10 transition-colors'
                  }
                >
                  <span
                    className={
                      isPremium
                        ? 'material-symbols-outlined text-secondary text-2xl'
                        : 'material-symbols-outlined text-primary group-hover:text-secondary text-2xl'
                    }
                  >
                    {service.icon}
                  </span>
                </div>

                <h3 className={`font-serif text-2xl mb-6 ${isPremium ? '' : 'text-primary'}`}>{service.title}</h3>

                <ul
                  className={
                    isPremium
                      ? 'space-y-4 mb-10 flex-grow font-light text-primary-fixed-dim'
                      : 'space-y-4 mb-10 flex-grow font-light text-on-surface-variant'
                  }
                >
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="text-secondary mt-1" aria-hidden="true">
                        ✦
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                <a
                  href={service.href ?? '#contact'}
                  className="text-xs uppercase tracking-[0.15em] text-secondary font-semibold text-left flex items-center gap-2 group-hover:gap-4 transition-all"
                >
                  View Details <span className="w-4 h-px bg-secondary" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
