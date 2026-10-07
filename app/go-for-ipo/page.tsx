import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getConsultNowUrl } from '@/lib/ipoSettings';
import { GoForIpoClient } from '@/components/ipo/GoForIpoClient';

export const metadata: Metadata = {
  title: 'What Is an IPO? — Go for IPO',
  description:
    'A 5-minute interactive primer for first-time investors: what an IPO is, how it works, and who regulates it in India. Includes a self-check and a 6-question quiz.',
};

// This page embeds a self-contained interactive widget (own fonts/CSS,
// vanilla-JS quiz/scoring logic) rather than a full JSX port, to preserve
// its behavior exactly. The Consult Now URL is admin-editable and fetched
// fresh on every request so changes go live immediately.
export const dynamic = 'force-dynamic';

export default async function GoForIpoPage() {
  const consultNowUrl = await getConsultNowUrl();

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Source+Sans+3:wght@300;400;600;700&display=swap"
      />
      <Navbar forceSolid />
      {/* Clears the fixed Navbar so it doesn't overlap the widget's own cover/logo */}
      <div className="pt-20 md:pt-24">
        <GoForIpoClient consultNowUrl={consultNowUrl} logoUrl="/logo.png" />
      </div>
      <Footer />
    </>
  );
}
