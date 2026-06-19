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

export default function Home() {
  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-secondary-fixed selection:text-on-secondary-fixed relative overflow-hidden">
      <ClientComponents />

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
