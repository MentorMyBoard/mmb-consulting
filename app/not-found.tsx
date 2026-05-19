import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary text-on-primary flex items-center justify-center px-8">
      <div className="text-center max-w-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-6">404 — Not Found</p>
        <h1 className="font-serif text-5xl md:text-6xl mb-6">This page slipped past compliance.</h1>
        <p className="text-primary-fixed-dim mb-10 leading-relaxed">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved. Let&rsquo;s get you back to safer
          ground.
        </p>
        <Link
          href="/"
          className="inline-block bg-secondary text-primary px-10 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-white transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
