'use client';

import { motion } from 'framer-motion';

const mmbNetwork = [
  {
    id: 'main',
    name: 'MentorMyBoard',
    label: 'Main Platform',
    description:
      'The flagship destination for strategic governance, board advisory, investment banking and compliance solutions.',
    url: 'https://mentormyboard.com',
    icon: 'home',
    current: false,
  },
  {
    id: 'consulting',
    name: 'Board Consulting',
    label: 'Consulting',
    description:
      'Dedicated advisory for board effectiveness, governance frameworks and strategic leadership mandates.',
    url: 'https://consulting.mentormyboard.com',
    icon: 'handshake',
    current: true,
  },
  {
    id: 'boardopp',
    name: 'Board Opportunity',
    label: 'Opportunities',
    description:
      'Curated board-level openings connecting distinguished leaders with purpose-driven organisations.',
    url: 'https://boardopp.mentormyboard.com',
    icon: 'trending_up',
    current: false,
  },
  {
    id: 'boardedu',
    name: 'Board Education',
    label: 'Education',
    description:
      'Certification programmes and executive education for aspiring and practising board members.',
    url: 'https://boardedu.mentormyboard.com',
    icon: 'school',
    current: false,
  },
  {
    id: 'womb',
    name: 'WOMB Circle',
    label: 'Women in Leadership',
    description:
      'Women on Management & Board — empowering women leaders to claim their seat at the table.',
    url: 'https://mmbwombcircle.com',
    icon: 'diversity_3',
    current: false,
  },
];

export default function ExploreMMB() {
  return (
    <section id="explore-mmb" className="py-28 px-8 md:px-16 bg-primary relative overflow-hidden">
      {/* Subtle grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')]"
        aria-hidden="true"
      />
      {/* Gold accent line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-4 font-semibold">
            The MMB Ecosystem
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-on-primary mb-5">
            Explore MentorMyBoard
          </h2>
          <p className="text-on-primary/60 max-w-xl mx-auto font-light text-lg">
            Five verticals. One mission — elevating governance and leadership across India.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mmbNetwork.map((site, idx) => (
            <motion.a
              key={site.id}
              href={site.url}
              target={site.current ? '_self' : '_blank'}
              rel={site.current ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
              className={`group relative flex flex-col gap-5 p-8 border transition-all duration-500 cursor-pointer
                ${site.current
                  ? 'border-secondary/60 bg-secondary/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-secondary/40'
                }
                ${idx === 3 ? 'lg:col-start-1' : ''}
                ${idx === 4 ? 'sm:col-start-2 lg:col-start-2' : ''}
              `}
            >
              {/* Current badge */}
              {site.current && (
                <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.2em] text-secondary font-semibold border border-secondary/40 px-2 py-0.5">
                  You are here
                </span>
              )}

              {/* Icon */}
              <div className={`w-11 h-11 flex items-center justify-center border transition-colors duration-500
                ${site.current ? 'border-secondary/60 text-secondary' : 'border-white/20 text-secondary/70 group-hover:border-secondary/60 group-hover:text-secondary'}
              `}>
                <span className="material-symbols-outlined text-xl" aria-hidden="true">
                  {site.icon}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-secondary/70 font-semibold mb-1">
                  {site.label}
                </p>
                <h3 className="font-serif text-xl text-on-primary mb-3 group-hover:text-secondary transition-colors duration-300">
                  {site.name}
                </h3>
                <p className="text-on-primary/50 text-sm font-light leading-relaxed">
                  {site.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2 text-secondary/60 group-hover:text-secondary transition-all duration-300">
                <span className="text-xs uppercase tracking-[0.15em] font-semibold">
                  {site.current ? 'Current site' : 'Visit'}
                </span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">
                  arrow_forward
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
