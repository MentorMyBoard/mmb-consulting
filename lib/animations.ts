import type { Variants } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

export const revealTransition: Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE },
  },
};

export const lineReveal: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
};

/** Use on a container — children should use fadeInUp or scaleIn */
export const cardHover = {
  rest: { y: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  hover: {
    y: -10,
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    transition: { duration: 0.35, ease: EASE },
  },
};
