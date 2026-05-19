/**
 * Services rendered in the services bento grid.
 * Add / remove / reorder entries here — no component changes required.
 * The middle card (index 1) gets the premium highlight treatment automatically.
 */

export type Service = {
  id: string;
  title: string;
  icon: string; // material-symbols icon name
  bullets: string[];
  href?: string;
};

export const services: Service[] = [
  {
    id: 'governance-board',
    title: 'Governance & Board',
    icon: 'account_balance',
    bullets: [
      'Board Evaluations & Induction',
      'ESG Strategy & Reporting',
      'Succession Planning',
    ],
    href: '#contact',
  },
  {
    id: 'investment-banking',
    title: 'Investment Banking',
    icon: 'monetization_on',
    bullets: [
      'Private Equity & Venture Capital',
      'Cross-Border M&A Advisory',
      'Debt Restructuring (₹500Cr+)',
    ],
    href: '#contact',
  },
  {
    id: 'legal-compliance',
    title: 'Legal & Compliance',
    icon: 'gavel',
    bullets: [
      'IPO Readiness & Management',
      'FEMA & RBI Compliance',
      'Corporate Restructuring',
    ],
    href: '#contact',
  },
];
