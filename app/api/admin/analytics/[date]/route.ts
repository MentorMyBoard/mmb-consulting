/**
 * DELETE /api/admin/analytics/[date]
 * Protected by proxy.ts Basic Auth. Removes every analytics event recorded
 * on the given IST calendar day (date = 'YYYY-MM-DD').
 */
import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AnalyticsEvent } from '@/models/AnalyticsEvent';
import { istDayRangeUtc } from '@/lib/dailyAnalytics';
import { errorDetail } from '@/lib/errors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  if (!DATE_RE.test(date)) {
    return NextResponse.json({ ok: false, error: 'Invalid date.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const { start, end } = istDayRangeUtc(date);
    const result = await AnalyticsEvent.deleteMany({ createdAt: { $gte: start, $lte: end } });

    return NextResponse.json({ ok: true, deleted: result.deletedCount }, { status: 200 });
  } catch (err) {
    console.error('[admin/analytics] failed to delete day:', err);
    return NextResponse.json(
      { ok: false, error: `Something went wrong: ${errorDetail(err)}` },
      { status: 500 },
    );
  }
}
