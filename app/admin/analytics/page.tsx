/**
 * /admin/analytics — Server Component shell.
 *
 * Auth is enforced by proxy.ts via Basic Auth. Shows a day-by-day (IST)
 * breakdown of page views, popup clicks, and form submissions. History is
 * kept indefinitely; the admin can delete a day's record explicitly.
 */
import { loadDailyStats } from '@/lib/dailyAnalytics';
import { AnalyticsManager } from '@/components/admin/AnalyticsManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AnalyticsPage() {
  const { stats, loadError, todayIst, yesterdayIst } = await loadDailyStats();

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-2 text-sm">
            Day-by-day site activity, Indian Standard Time. Today and yesterday always show, even
            with zero activity; history is kept until you delete a row.
          </p>
        </header>

        {loadError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
            Could not load analytics: {loadError}
          </div>
        )}

        <AnalyticsManager initialStats={stats} todayIst={todayIst} yesterdayIst={yesterdayIst} />
      </div>
    </div>
  );
}
