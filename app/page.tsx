import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Leadership from '@/components/Leadership';
import AdvisoryBoard from '@/components/AdvisoryBoard';
import Testimonial from '@/components/Testimonial';
import Advisory from '@/components/Advisory';
import Partners from '@/components/Partners';
import Contact from '@/components/Contact';
import ExploreMMB from '@/components/ExploreMMB';
import Footer from '@/components/Footer';
import { ClientComponents } from '@/components/ClientComponents';
import { getActivePopups } from '@/lib/popups';

// Popups are embedded server-side so they appear the instant the page paints
// — no client fetch round-trip. The page stays effectively static (served
// from cache); `revalidatePath('/')` in the admin popup routes invalidates
// this cache the moment an admin actually changes something, and this
// interval is just a safety-net backstop.
export const revalidate = 60;

export default async function Home() {
  const popups = await getActivePopups();

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-secondary-fixed selection:text-on-secondary-fixed relative overflow-hidden">
      <ClientComponents initialPopups={popups} />

      {/* Subtle grain overlay for premium texture */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')]"
        aria-hidden="true"
      />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Services />
        <Leadership />
        <AdvisoryBoard />
        <Testimonial />
        <Advisory />
        <Partners />
        <Contact />
        <ExploreMMB />
      </main>

      <Footer />
    </div>
  );
}
