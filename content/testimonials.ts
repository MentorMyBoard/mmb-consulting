export type Testimonial = {
  id: string;
  quote: string;
  attribution: string;
  organization?: string;
};

/**
 * To add more testimonials, append objects to this array.
 * Each testimonial shows for 10 seconds in the auto-scroller.
 */
export const testimonials: Testimonial[] = [
  {
    id: 'fortune-500-chairman',
    quote:
      "MentorMyBoard transformed our approach to governance. Their strategic insights didn't just ensure compliance—they unlocked new pathways for growth.",
    attribution: 'Chairman',
    organization: 'Fortune 500 Enterprise',
  },
  {
    id: 'growth-stage-ceo',
    quote:
      'The governance framework MMB built for us gave investors the confidence to back our Series B. Their board-level advisory is unmatched.',
    attribution: 'CEO',
    organization: 'Growth-Stage Technology Firm',
  },
  {
    id: 'family-business-promoter',
    quote:
      'Transitioning our family business to a professionally governed entity seemed daunting — MMB made it seamless and strategic.',
    attribution: 'Promoter & Managing Director',
    organization: 'Multi-Generational Family Business',
  },
  {
    id: 'listed-entity-md',
    quote:
      'Their IPO readiness advisory was comprehensive and precise. We listed successfully, fully compliant and investor-ready.',
    attribution: 'Managing Director',
    organization: 'Listed Entity, BSE SME',
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
