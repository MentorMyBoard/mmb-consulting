'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { DailyStat } from '@/lib/dailyAnalytics';

function formatDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function AnalyticsManager({
  initialStats,
  todayIst,
  yesterdayIst,
}: {
  initialStats: DailyStat[];
  todayIst: string;
  yesterdayIst: string;
}) {
  const [stats, setStats] = useState<DailyStat[]>(initialStats);
  const [busyDate, setBusyDate] = useState<string | null>(null);

  async function deleteDay(date: string) {
    if (!window.confirm(`Delete all analytics records for ${formatDateLabel(date)}? This can't be undone.`)) {
      return;
    }

    setBusyDate(date);
    try {
      const res = await fetch(`/api/admin/analytics/${date}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        toast.error(json.error || 'Failed to delete record.');
        return;
      }
      setStats((prev) =>
        prev.map((s) => (s.date === date ? { ...s, pageViews: 0, popupClicks: 0, formSubmits: 0 } : s)),
      );
      toast.success('Record deleted.');
    } catch {
      toast.error('Network error — please try again.');
    } finally {
      setBusyDate(null);
    }
  }

  if (stats.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded p-8 text-center text-slate-500">
        No analytics recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <Th>Date</Th>
              <Th>Page Views</Th>
              <Th>Popup Clicks</Th>
              <Th>Form Submissions</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.date} className="border-t border-slate-100">
                <Td>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{formatDateLabel(s.date)}</span>
                    {s.date === todayIst && <Badge color="blue">Today</Badge>}
                    {s.date === yesterdayIst && <Badge color="amber">Yesterday</Badge>}
                  </div>
                </Td>
                <Td>{s.pageViews.toLocaleString()}</Td>
                <Td>{s.popupClicks.toLocaleString()}</Td>
                <Td>{s.formSubmits.toLocaleString()}</Td>
                <Td>
                  <button
                    onClick={() => deleteDay(s.date)}
                    disabled={busyDate === s.date}
                    className="text-red-600 hover:underline text-xs disabled:opacity-50"
                  >
                    {busyDate === s.date ? 'Deleting…' : 'Delete'}
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: 'blue' | 'amber' }) {
  const colors = { blue: 'bg-blue-100 text-blue-700', amber: 'bg-amber-100 text-amber-700' };
  return <span className={`text-xs px-2 py-0.5 rounded ${colors[color]}`}>{children}</span>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 text-xs uppercase tracking-wide font-semibold">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-slate-700">{children}</td>;
}
