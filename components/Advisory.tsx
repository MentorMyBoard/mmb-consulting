'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/animations';
import { TiltCard } from '@/components/ui/TiltCard';

const mandateSteps = [
  {
    number: '01',
    title: 'Governance Audit',
    description:
      'Comprehensive evaluation of board composition, committee structures, charter gaps, and compliance posture to establish a clear baseline.',
  },
  {
    number: '02',
    title: 'Strategic Roadmap',
    description:
      'A bespoke transformation plan calibrated to your industry, scale, and regulatory environment — with milestones the board can own.',
  },
  {
    number: '03',
    title: 'Director Placement',
    description:
      'We identify, assess, and onboard independent directors and advisors whose expertise precisely complements your strategic objectives.',
  },
  {
    number: '04',
    title: 'Ongoing Retainer',
    description:
      'Continuous advisory covering evaluation cycles, committee reviews, regulatory updates, ESG integration, and succession planning.',
  },
];

const focusAreas = [
  { icon: 'domain',          label: 'Listed Entities' },
  { icon: 'rocket_launch',   label: 'Growth-Stage Companies' },
  { icon: 'public',          label: 'Cross-Border Enterprises' },
  { icon: 'account_balance', label: 'Financial Institutions' },
  { icon: 'eco',             label: 'ESG-Focused Organisations' },
  { icon: 'family_restroom', label: 'Family Business Governance' },
];

export default function Advisory() {
  return (
    <section id="advisory" className="py-32 px-8 md:px-16 bg-surface-container">
      <div className="max-w-7xl mx-auto">

        {/* Section header — slides from left */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInLeft}
          className="mb-20 border-l-4 border-secondary pl-8"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">The Advisory Mandate</h2>
          <p className="text-xl text-on-surface-variant font-light">
            Our structured approach to board transformation.
          </p>
        </motion.div>

        {/* 3D tilt mandate step cards — stagger up */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {mandateSteps.map((step) => (
            <motion.div key={step.number} variants={fadeInUp}>
              <TiltCard
                maxDeg={12}
                className="group relative border border-outline-variant bg-white p-8 hover:border-secondary/60 hover:shadow-2xl transition-colors duration-500 overflow-hidden cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/0 via-secondary/60 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="font-serif text-6xl text-secondary/15 block mb-6 group-hover:text-secondary/35 transition-colors duration-300 leading-none">
                  {step.number}
                </span>
                <h3 className="font-serif text-xl text-primary mb-4">{step.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed font-light">{step.description}</p>
                <div className="w-8 h-px bg-secondary mt-6 group-hover:w-16 transition-all duration-500" />
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Focus areas + CTA */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left — slides from left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInLeft}
          >
            <h3 className="font-serif text-3xl md:text-4xl text-primary mb-6 leading-tight">
              Advisory Focus Areas
            </h3>
            <p className="text-on-surface-variant mb-10 leading-relaxed font-light text-lg">
              Our advisory practice spans entities at every stage of maturity and complexity, delivering
              governance solutions calibrated to your unique institutional context.
            </p>
            <a
              href="#contact"
              className="group inline-flex items-center gap-4 bg-primary text-on-primary px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-secondary hover:text-primary transition-all duration-300"
            >
              Request an Advisory Brief
              <span
                className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </a>
          </motion.div>

          {/* Right — focus area tiles slide from right with stagger */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInRight}
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {focusAreas.map((area) => (
                <motion.div
                  key={area.label}
                  variants={fadeInUp}
                  className="flex items-center gap-4 p-5 border border-outline-variant group hover:border-secondary/60 hover:bg-white hover:shadow-md transition-all duration-300 cursor-default"
                >
                  <span
                    className="material-symbols-outlined text-secondary text-xl flex-shrink-0 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300"
                    aria-hidden="true"
                  >
                    {area.icon}
                  </span>
                  <span className="text-sm text-on-surface font-light leading-snug">{area.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
