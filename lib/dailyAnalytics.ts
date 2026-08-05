/**
 * Day-wise analytics, bucketed in Indian Standard Time (the business's
 * timezone) rather than UTC or server-local time.
 */
import { connectToDatabase } from '@/lib/mongodb';
import { AnalyticsEvent } from '@/models/AnalyticsEvent';
import { errorDetail } from '@/lib/errors';

const IST_TIME_ZONE = 'Asia/Kolkata';

export interface DailyStat {
  date: string; // YYYY-MM-DD, in IST
  pageViews: number;
  popupClicks: number;
  formSubmits: number;
}

/** 'YYYY-MM-DD' for the given instant, as a calendar day in IST. */
export function istDateString(d: Date): string {
  return d.toLocaleDateString('en-CA', { timeZone: IST_TIME_ZONE });
}

/** UTC instant range [start, end] covering one IST calendar day. */
export function istDayRangeUtc(dateStr: string): { start: Date; end: Date } {
  return {
    start: new Date(`${dateStr}T00:00:00.000+05:30`),
    end: new Date(`${dateStr}T23:59:59.999+05:30`),
  };
}

export interface DailyStatsResult {
  stats: DailyStat[];
  loadError: string | null;
  todayIst: string;
  yesterdayIst: string;
}

export async function loadDailyStats(): Promise<DailyStatsResult> {
  // Today and yesterday always appear, even with zero activity, so the
  // admin never sees an ambiguous "row is just missing" state for them.
  const today = istDateString(new Date());
  const yesterday = istDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));

  try {
    await connectToDatabase();

    const rows = await AnalyticsEvent.aggregate([
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: IST_TIME_ZONE } },
            type: '$type',
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const byDay: Record<string, DailyStat> = {};
    for (const row of rows as { _id: { day: string; type: string }; count: number }[]) {
      const day = row._id.day;
      byDay[day] ??= { date: day, pageViews: 0, popupClicks: 0, formSubmits: 0 };
      if (row._id.type === 'page_view') byDay[day].pageViews = row.count;
      else if (row._id.type === 'popup_click') byDay[day].popupClicks = row.count;
      else if (row._id.type === 'form_submit') byDay[day].formSubmits = row.count;
    }

    byDay[today] ??= { date: today, pageViews: 0, popupClicks: 0, formSubmits: 0 };
    byDay[yesterday] ??= { date: yesterday, pageViews: 0, popupClicks: 0, formSubmits: 0 };

    const stats = Object.values(byDay).sort((a, b) => b.date.localeCompare(a.date));
    return { stats, loadError: null, todayIst: today, yesterdayIst: yesterday };
  } catch (err) {
    console.error('[admin] failed to load daily analytics:', err);
    return { stats: [], loadError: errorDetail(err), todayIst: today, yesterdayIst: yesterday };
  }
}
