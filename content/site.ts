/**
 * Site-wide configuration.
 * Edit this file to update branding, navigation, and contact details
 * across the entire website without touching component code.
 */

export const siteConfig = {
  name: 'MentorMyBoard',
  shortName: 'MMB',
  tagline: 'Strategic Governance Excellence',
  description:
    'MentorMyBoard delivers strategic governance, board advisory, investment banking, and legal & compliance solutions for modern enterprises.',
  url: "https://mentormyboard.com",

  founded: 2018,
  copyrightYear: new Date().getFullYear(),

  contact: {
    email: 'info@mentormyboard.com',
    phoneDisplay: '+91 73041 45928',
    address: 'Office No.207, Building 3, Sector III, MBP Road, Millenium Business Park, Mahape, Navi Mumbai, Maharashtra 400710',
    whatsappNumber: '917304145928',
    whatsappMessage: "Hello MentorMyBoard, I'd like to discuss a board advisory mandate.",
  },

  social: {
    linkedin: 'https://www.linkedin.com/company/mentormyboard',
    twitter: 'https://twitter.com/mentormyboard',
  },

  navigation: [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Leadership', href: '#leadership' },
    { label: 'Advisory', href: '#advisory' },
    { label: 'Contact', href: '#contact' },
  ],

  footer: {
    services: [
      { label: 'Board Advisory', href: '#services' },
      { label: 'IPO Readiness', href: '#services' },
      { label: 'ESG Compliance', href: '#services' },
    ],
    company: [
      { label: 'About MMB', href: 'https://mentormyboard.com' },
      { label: 'Leadership', href: '#leadership' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy Policy', href: 'https://mentormyboard.com/privacy-policy' },
      { label: 'Terms & Conditions', href: 'https://mentormyboard.com/terms-and-condition' },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
