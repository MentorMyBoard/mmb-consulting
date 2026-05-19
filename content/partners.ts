export type Partner = {
  id: string;
  name: string;
  logoUrl: string;
};

/**
 * Partner / association logos shown in the auto-scrolling ticker above the Contact form.
 * Save logo images to public/partners/ and reference them here.
 * Recommended format: PNG or SVG, ideally monochrome / single-colour so they blend with the background.
 * Minimum 4 partners recommended so the scroller loops smoothly.
 */
export const partners: Partner[] = [
  { id: 'bse', name: 'BSE', logoUrl: '/partners/bse.png' },
  { id: 'icai', name: 'ICAI', logoUrl: '/partners/icai.png' },
  { id: 'icsi', name: 'ICSI', logoUrl: '/partners/icsi.png' },
  { id: 'sebi', name: 'SEBI', logoUrl: '/partners/sebi.png' },
  { id: 'niti-aayog', name: 'NITI Aayog', logoUrl: '/partners/niti-aayog.png' },
];
