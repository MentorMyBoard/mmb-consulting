/**
 * /admin/ipo-leads — Server Component.
 *
 * Auth is enforced by proxy.ts via Basic Auth. Shows leads captured on the
 * "Go for IPO" page, that page's visit count, and the admin-editable
 * "Consult Now" CTA URL used on that page's completion popup.
 */
import { connectToDatabase } from '@/lib/mongodb';
import { IpoLead, type IIpoLead } from '@/models/IpoLead';
import { IpoSettings, IPO_SETTINGS_ID } from '@/models/IpoSettings';
import { AnalyticsEvent } from '@/models/AnalyticsEvent';
import { IpoSettingsForm } from '@/components/admin/IpoSettingsForm';
import { IpoLeadsManager } from '@/components/admin/IpoLeadsManager';
import { errorDetail } from '@/lib/errors';
import type { IpoLeadDTO } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const IPO_PATH = '/go-for-ipo';

async function loadLeads(): Promise<{ leads: IIpoLead[]; loadError: string | null }> {
  try {
    await connectToDatabase();
    const docs = await IpoLead.find().sort({ createdAt: -1 }).lean();
    return { leads: docs as unknown as IIpoLead[], loadError: null };
  } catch (err) {
    console.error('[admin] failed to load IPO leads:', err);
    return { leads: [], loadError: errorDetail(err) };
  }
}

async function loadVisits(): Promise<number> {
  try {
    await connectToDatabase();
    return await AnalyticsEvent.countDocuments({ type: 'page_view', path: IPO_PATH });
  } catch (err) {
    console.error('[admin] failed to load IPO page visits:', err);
    return 0;
  }
}

async function loadConsultNowUrl(): Promise<string> {
  try {
    await connectToDatabase();
    const doc = await IpoSettings.findById(IPO_SETTINGS_ID).lean();
    return doc?.consultNowUrl ?? '';
  } catch (err) {
    console.error('[admin] failed to load IPO settings:', err);
    return '';
  }
}

export default async function IpoLeadsPage() {
  const [{ leads, loadError }, visits, consultNowUrl] = await Promise.all([
    loadLeads(),
    loadVisits(),
    loadConsultNowUrl(),
  ]);

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900">Go for IPO — Leads</h1>
          <p className="text-slate-600 mt-2 text-sm">
            Visitors who answered a quiz question on the Go for IPO page are prompted for their
            details. Entries appear here.
          </p>
        </header>

        {loadError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
            Could not load leads: {loadError}
          </div>
        )}

        <div className="mb-6 bg-white border border-slate-200 rounded p-4 inline-block">
          <div className="text-xs uppercase tracking-wide font-semibold text-slate-500">
            Page visits
          </div>
          <div className="text-2xl font-serif text-slate-900">{visits.toLocaleString()}</div>
        </div>

        <IpoSettingsForm initialUrl={consultNowUrl} />

        <IpoLeadsManager initialLeads={JSON.parse(JSON.stringify(leads)) as IpoLeadDTO[]} />
      </div>
    </div>
  );
}
