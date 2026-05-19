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
  { id: 'bse', name: 'BSE', logoUrl: '/partners/i-spark.jpg' },
  { id: 'procs', name: 'procs', logoUrl: '/partners/procs.jpg' },
  { id: 'pantomath', name: 'pantomath', logoUrl: '/partners/pantomath.jpg' },
  { id: 'pillai', name: 'pillai', logoUrl: '/partners/pillai.jpg' },
  { id: 'rtp', name: 'rtp', logoUrl: '/partners/rtp.jpg' },
  { id: 'equations', name: 'equations', logoUrl: '/partners/equations.jpg' },
  { id: 'sepentia', name: 'sepentia', logoUrl: '/partners/sepentia.jpg' },
  { id: 'ba', name: 'ba', logoUrl: '/partners/ba.jpg' },
  { id: 'relligio', name: 'relligio', logoUrl: '/partners/relligio.jpg' },
  { id: 'optimist', name: 'optimist', logoUrl: '/partners/optimist.jpg' },
  { id: 'mentor', name: 'mentor', logoUrl: '/partners/mentor.jpg' },
  { id: 'ila', name: 'ila', logoUrl: '/partners/ila.jpg' },
  { id: 'zenesse', name: 'zenesse', logoUrl: '/partners/zenesse.jpg' },
  { id: 'impact', name: 'impact', logoUrl: '/partners/impact.jpg' },
  { id: 'shunya', name: 'shunya', logoUrl: '/partners/shunya.jpg' },
  { id: 'p4g', name: 'p4g', logoUrl: '/partners/p4g.jpg' },
  { id: 'samsara', name: 'samsara', logoUrl: '/partners/samsara.jpg' },
  { id: 'amazin', name: 'amazin', logoUrl: '/partners/amazin.jpg' },
  { id: 'terrapledge', name: 'terrapledge', logoUrl: '/partners/terrapledge.jpg' },
  { id: 'legal', name: 'legal', logoUrl: '/partners/legal.jpg' },
  { id: 'ouriken', name: 'ouriken', logoUrl: '/partners/ouriken.jpg' },
  { id: 'rhyyns', name: 'rhyyns', logoUrl: '/partners/rhyyns.jpg' },
  { id: 'cloud', name: 'cloud', logoUrl: '/partners/cloud.jpg' },
  { id: 'esg', name: 'esg', logoUrl: '/partners/esg.jpg' },
  { id: 'prudent', name: 'prudent', logoUrl: '/partners/prudent.jpg' },
  { id: 'mg', name: 'mg', logoUrl: '/partners/mg.jpg' },
  { id: 'mentor-finance', name: 'mentor-finance', logoUrl: '/partners/mentor-finance.jpg' },
  { id: 'share-india', name: 'share-india', logoUrl: '/partners/share-india.jpg' },
];
