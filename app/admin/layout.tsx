/**
 * Shared shell for /admin/* pages — just a small nav bar tying the
 * (currently two) internal tools together. Auth is enforced by proxy.ts.
 */
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-slate-900 text-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center gap-6">
          <span className="text-sm font-serif tracking-wide text-white">MentorMyBoard Admin</span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin/submissions" className="hover:text-white transition-colors">
              Submissions
            </Link>
            <Link href="/admin/popups" className="hover:text-white transition-colors">
              Popups
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
