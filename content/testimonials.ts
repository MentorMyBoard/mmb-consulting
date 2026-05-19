export type Testimonial = {
  id: string;
  quote: string;
  attribution: string;
  organization?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 'fortune-500-chairman',
    quote:
      "MentorMyBoard transformed our approach to governance. Their strategic insights didn't just ensure compliance—they unlocked new pathways for growth.",
    attribution: 'Chairman',
    organization: 'Fortune 500 Enterprise',
  },
];

export type Stat = {
  value: string;
  label: string;
};

export const heroStats: Stat[] = [
  { value: '₹18,000+ Cr', label: 'Transaction Mandates' },
  { value: '3+ Decades', label: 'Leadership' },
  { value: '₹500+ Cr', label: 'Debt Restructuring' },
  { value: 'Global', label: 'Cross-Border M&A' },
];

export type Requirement = {
  value: string;
  label: string;
};

/** Options shown in the contact form's "Strategic Requirement" dropdown. */
export const requirements: Requirement[] = [
  { value: 'board-governance', label: 'Board Governance' },
  { value: 'investment-banking', label: 'Investment Banking' },
  { value: 'legal-compliance', label: 'Legal & Compliance' },
  { value: 'm-and-a', label: 'M&A Advisory' },
  { value: 'ipo-readiness', label: 'IPO Readiness' },
  { value: 'esg-strategy', label: 'ESG Strategy' },
  { value: 'other', label: 'Other' },
];
