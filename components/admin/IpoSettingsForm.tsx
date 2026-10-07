'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function IpoSettingsForm({ initialUrl }: { initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ipo-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultNowUrl: url }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        toast.error(json.error || 'Failed to save.');
        return;
      }
      setUrl(json.consultNowUrl);
      toast.success('Consult Now URL saved.');
    } catch {
      toast.error('Network error — please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded p-4 mb-6">
      <label className="block text-xs uppercase tracking-wide font-semibold text-slate-600 mb-1">
        &ldquo;Consult Now&rdquo; button URL
      </label>
      <p className="text-xs text-slate-500 mb-2">
        Shown after a visitor finishes all 6 quiz questions on the Go for IPO page.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={save}
          disabled={saving}
          className="bg-slate-900 text-white text-sm px-5 py-2 rounded disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
