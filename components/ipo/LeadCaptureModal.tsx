'use client';

import { useState } from 'react';
import { ipoLeadSchema } from '@/lib/validations';

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
};

export function LeadCaptureModal({
  onClose,
  onSubmitted,
}: {
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', company: '', role: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    const result = ipoLeadSchema.safeParse(form);
    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/ipo-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrors([json.error || 'Something went wrong. Please try again.']);
        return;
      }
      setDone(true);
      onSubmitted();
    } catch {
      setErrors(['Network error — please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-md p-6 md:p-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          ×
        </button>

        {done ? (
          <div className="text-center py-6">
            <h3 className="font-serif text-2xl text-slate-900 mb-2">Thank you.</h3>
            <p className="text-slate-600 text-sm">Carry on with the quiz — your details are saved.</p>
            <button
              onClick={onClose}
              className="mt-6 bg-[#1C1A6E] text-white text-sm uppercase tracking-wider px-6 py-3"
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="font-serif text-2xl text-slate-900 mb-1">Before you continue</h3>
            <p className="text-slate-600 text-sm mb-5">
              Share your details to unlock the quiz — so we can follow up on your IPO readiness
              journey.
            </p>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3 mb-4 space-y-1">
                {errors.map((msg, i) => (
                  <div key={i}>{msg}</div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full name *"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="tel"
                placeholder="Phone *"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Company (optional)"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Role (optional)"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full bg-[#1C1A6E] text-white text-sm uppercase tracking-wider px-6 py-3 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit & Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
