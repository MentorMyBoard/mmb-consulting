'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerFromLeft, staggerFromRight } from '@/lib/animations';

export default function About() {
  return (
    <section id="about" className="bg-surface py-32 px-8 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerFromLeft}
          className="relative group"
        >
          <div className="absolute inset-0 bg-secondary/10 translate-x-4 translate-y-4 rounded-lg -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Executive boardroom discussion"
            className="w-full aspect-[4/3] object-cover rounded-lg shadow-2xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3LgjtUdbyZIZIQlwLPN2I9ZNd2v1CJUlUol5sy8bGe4RfVz5Rt_puXhGBZyumdZndUe_166wdOg2ZbstK7EVCCVl6_Ir818usYRTBeZwei0JI0n4MX3DkktIfNTTmkUaXkF6_h4cWE6ThkU8YhPrw0eAxDeMk8E3Sj_lTYIq9jzrlJ9Os_CI8uyJx-qmt1B-i6DFAki93posDl8W0QsiHzi6aC1wNu0Qk4itNLjzCGCctj2Cw059tm-EkFB2mQ6Gf4jAWzrqOzKFX"
            loading="lazy"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="absolute -bottom-8 -right-8 bg-primary text-on-primary p-8 shadow-2xl hidden md:block"
          >
            <span className="font-serif text-5xl mb-2 block text-secondary">22+</span>
            <p className="text-sm uppercase tracking-widest text-primary-fixed-dim">Years of Insight</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerFromRight}
        >
          <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl text-primary mb-8 leading-tight">
            A Governance-First <br /> Advisory Ecosystem
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-on-surface-variant text-lg mb-6 leading-relaxed font-light">
            MentorMyBoard stands at the intersection of boardroom excellence and strategic business growth. We provide a
            rigorous framework for organizations to navigate the complexities of modern governance while driving
            substantial value for shareholders.
          </motion.p>
          <motion.p variants={fadeInUp} className="text-on-surface-variant text-lg mb-10 leading-relaxed font-light">
            Our approach combines deep institutional knowledge with contemporary agility, ensuring your board is not
            just compliant, but a strategic engine for the enterprise.
          </motion.p>
          <motion.a
            variants={fadeInUp}
            href="#services"
            className="group inline-flex items-center gap-4 text-sm uppercase tracking-[0.15em] text-secondary font-semibold cursor-pointer"
          >
            Learn our methodology
            <span className="w-8 h-px bg-secondary transition-all duration-300 group-hover:w-16" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
