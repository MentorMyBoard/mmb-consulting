/**
 * Founder profiles for the leadership section.
 * Update bios, titles, and images here.
 */

export type Founder = {
  id: string;
  name: string;
  title: string;
  years: string;
  tagline: string;
  bio: string;
  imageUrl: string;
  linkedin?: string;
};

export const founders: Founder[] = [
  {
    id: 'divya-momaya',
    name: 'Divya Momaya',
    title: 'Founder & Lead Consultant',
    years: '22+ Years',
    tagline: 'Independent Director at multiple listed entities.',
    bio: 'Qualified Company Secretary (ICSI) and IICA-qualified Independent Director. Founding Partner of D. S. Momaya & Co. LLP with 22+ years of industry experience and 18+ years in whole-time Company Secretarial Practice. Co-chairperson of Bombay Industries Association, Navi Mumbai Chapter, and Mentor with NITI Aayog and JIIF.',
    imageUrl: '/divya-momaya.png',
    linkedin: 'https://www.linkedin.com/in/divya-momaya',
  },
  {
    id: 'neha-shah',
    name: 'Neha Shah',
    title: 'Co-Founder & Director',
    years: '17+ Years',
    tagline: 'Expert in Corporate Compliance & Governance.',
    bio: 'A seasoned expert driving governance initiatives across diverse industrial sectors with a focus on institutional integrity, board effectiveness, and compliance architecture.',
    imageUrl: '/neha-shah.png',
  },
];
