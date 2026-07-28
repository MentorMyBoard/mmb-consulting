/**
 * /admin/popups — Server Component shell.
 *
 * Auth is enforced by proxy.ts via Basic Auth. Loads the current popup
 * list from MongoDB and hands it to the client-side manager, which owns
 * all create/edit/delete/show-hide interactivity.
 */
import { connectToDatabase } from '@/lib/mongodb';
import { Popup, type IPopup } from '@/models/Popup';
import { PopupManager } from '@/components/admin/PopupManager';
import { errorDetail } from '@/lib/errors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function loadPopups(): Promise<{ popups: IPopup[]; loadError: string | null }> {
  try {
    await connectToDatabase();
    const docs = await Popup.find().sort({ createdAt: -1 }).lean();
    return { popups: docs as unknown as IPopup[], loadError: null };
  } catch (err) {
    console.error('[admin] failed to load popups:', err);
    return { popups: [], loadError: errorDetail(err) };
  }
}

export default async function PopupsPage() {
  const { popups, loadError } = await loadPopups();

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900">Promotional Popups</h1>
          <p className="text-slate-600 mt-2 text-sm">
            Floating banners shown on the public site. Changes take effect immediately.
          </p>
        </header>

        {loadError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
            Could not load popups from the database: {loadError}
          </div>
        )}

        <PopupManager initialPopups={JSON.parse(JSON.stringify(popups))} />
      </div>
    </div>
  );
}
