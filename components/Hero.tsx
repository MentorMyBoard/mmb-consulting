'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { heroStats } from '@/content/testimonials';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-primary">
      <motion.div style={{ y: yParallax }} className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLUPvv3ix7Dt3CK1kNCrhH_zxsJ2xS0hqHSx33jbkweI5Ma1KMUqjXQbbg_T5ZepjI3ORdtRpytPDDW21mNJMP9wq0cAFntrP0iEIPG9EppMCnQlbLU233w-QOip3GTqQL1C5SBkzuVOmu2HrQuTeaxjyUtUbss6lzWq_H55BhoBvP9VkhA9CqCRNXVLrMFWx3zem9aVVFUWIpXlMrRd8Cv3GQ01awkjbG6wSnrRRvl3JCImqQKQpIgizeweBWeT3tqhiH5V-MvREM"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
      </motion.div>

      <div className="relative z-10 px-8 md:px-16 max-w-7xl mx-auto w-full pt-32">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-5xl md:text-7xl text-on-primary mb-6 leading-[1.1] tracking-tight"
          >
            Building Future-Ready <br />
            <span className="text-secondary italic">Boards &amp; Businesses</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-primary-fixed-dim mb-10 max-w-2xl font-light leading-relaxed"
          >
            Strategic Governance, Advisory, Investment Banking, Legal &amp; Compliance Solutions for Modern Enterprises.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            <a
              href="#services"
              className="bg-secondary text-primary px-10 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-white transition-all duration-300"
            >
              Explore Services
            </a>
            <a
              href="#contact"
              className="border border-secondary text-secondary px-10 py-4 text-sm uppercase tracking-[0.15em] hover:bg-secondary/10 backdrop-blur-sm transition-all duration-300"
            >
              Book Consultation
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-secondary/30 pt-8 bg-primary/20 backdrop-blur-md p-8 rounded-xl shadow-2xl"
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="group cursor-default">
              <span className="block font-serif text-3xl md:text-4xl text-on-primary mb-2 group-hover:text-secondary transition-colors duration-300">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-primary-fixed-dim">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
