/**
 * /admin/submissions — Server Component
 *
 * Auth is enforced by middleware.ts via Basic Auth.
 * This page fetches the latest 100 submissions from MongoDB and renders
 * them in a scannable table. The UI is intentionally minimal — this is
 * an internal operator tool, not a marketing surface.
 */
import { connectToDatabase } from '@/lib/mongodb';
import { Contact, type IContact } from '@/models/Contact';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function loadSubmissions(): Promise<IContact[]> {
  try {
    await connectToDatabase();
    const docs = await Contact.find().sort({ createdAt: -1 }).limit(100).lean();
    return docs as unknown as IContact[];
  } catch (err) {
    console.error('[admin] failed to load submissions:', err);
    return [];
  }
}

export default async function SubmissionsPage() {
  const submissions = await loadSubmissions();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900">Contact Submissions</h1>
          <p className="text-slate-600 mt-2 text-sm">
            Latest {submissions.length} inquiries · sorted newest first
          </p>
        </header>

        {submissions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded p-8 text-center text-slate-500">
            No submissions yet, or the database is not reachable.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <Th>Date</Th>
                    <Th>Name</Th>
                    <Th>Organization</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Requirement</Th>
                    <Th>Status</Th>
                    <Th>Notif/Conf</Th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={String(s._id)} className="border-t border-slate-100 hover:bg-slate-50 align-top">
                      <Td>
                        {new Date(s.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </Td>
                      <Td>
                        <div className="font-medium text-slate-900">{s.name}</div>
                      </Td>
                      <Td>{s.company}</Td>
                      <Td>
                        <a className="text-blue-600 hover:underline" href={`mailto:${s.email}`}>
                          {s.email}
                        </a>
                      </Td>
                      <Td>{s.phone}</Td>
                      <Td>{s.requirement}</Td>
                      <Td>
                        <StatusPill status={s.status} />
                      </Td>
                      <Td>
                        <span className="text-xs text-slate-500">
                          {s.emailNotificationSent ? '✓' : '✗'} / {s.emailConfirmationSent ? '✓' : '✗'}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Message details accordion — keeps the table scannable */}
        {submissions.length > 0 && (
          <details className="mt-8 bg-white border border-slate-200 rounded p-6">
            <summary className="cursor-pointer font-medium text-slate-700">View full messages</summary>
            <div className="mt-6 space-y-6">
              {submissions.map((s) => (
                <div key={`msg-${String(s._id)}`} className="border-b border-slate-100 pb-6 last:border-0">
                  <div className="flex justify-between items-baseline mb-2">
                    <strong className="text-slate-900">{s.name}</strong>
                    <span className="text-xs text-slate-500">
                      {new Date(s.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">
                    {s.company} · {s.requirement}
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{s.message}</p>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 text-xs uppercase tracking-wide font-semibold">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-slate-700">{children}</td>;
}

function StatusPill({ status }: { status: IContact['status'] }) {
  const colors: Record<IContact['status'], string> = {
    new: 'bg-blue-100 text-blue-700',
    in_review: 'bg-amber-100 text-amber-700',
    responded: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-slate-200 text-slate-700',
    spam: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${colors[status]}`}>{status.replace('_', ' ')}</span>
  );
}
