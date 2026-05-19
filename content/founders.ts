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

export type AdvisoryMember = {
  id: string;
  name: string;
  title: string;
  years: string;
  expertise: string;
  imageUrl: string;
};

/**
 * Advisory board member profiles.
 * Photos go in public/advisory/ — filenames match the imageUrl values below.
 * To add a new member, append an object to this array.
 */
export const advisoryBoard: AdvisoryMember[] = [
  {
    id: 'rajnickant-patel',
    name: 'Rajnickant Patel',
    title: 'Former MD & CEO, BSE & ICEX | Mentor, RegTech',
    years: '3+ Decades',
    expertise: 'Business Advisory & Scaling',
    imageUrl: '/advisory/rajnickant-patel.jpg',
  },
  {
    id: 'nilesh-vikamsey',
    name: 'Nilesh Vikamsey',
    title: 'Past President, ICAI | Senior Partner, KKC & Associates LLP',
    years: '3+ Decades',
    expertise: 'Statutory Audit & Risk Management',
    imageUrl: '/advisory/nilesh-vikamsey.jpg',
  },
  {
    id: 'amisha-vora',
    name: 'CA Amisha Vora',
    title: 'Managing Director, Prabhudas Liladher Pvt. Ltd.',
    years: '3+ Decades',
    expertise: 'Finance & Investment Banking',
    imageUrl: '/advisory/amisha-vora.jpg',
  },
  {
    id: 'sanjay-jain',
    name: 'Sanjay K Jain',
    title: 'Author | MD, T.T. Ltd.',
    years: '3+ Decades',
    expertise: 'Risk Management, Strategy & Business Growth',
    imageUrl: '/advisory/sanjay-jain.jpg',
  },
  {
    id: 'sridhar-ramachandran',
    name: 'Sridhar Ramachandran',
    title: 'ESG, Finance & Governance Expert | Asia & Africa',
    years: '3+ Decades',
    expertise: 'Financial Management across Asia & Africa',
    imageUrl: '/advisory/sridhar-ramachandran.jpg',
  },
  {
    id: 'sankara-ramnath',
    name: 'Sankara Ramnath',
    title: 'Author | Certified Mentor Coach | Founder & CEO, U2K Consulting',
    years: '3+ Decades',
    expertise: 'Finance, Strategy & Cash Flow Management',
    imageUrl: '/advisory/sankara-ramnath.jpg',
  },
];
