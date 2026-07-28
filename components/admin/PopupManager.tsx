'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { PopupForm } from '@/components/admin/PopupForm';
import type { PopupDTO, PopupPosition } from '@/lib/types';

const POSITION_LABELS: Record<PopupPosition, string> = {
  'left-top': 'Left Top',
  'left-bottom': 'Left Bottom',
  'right-top': 'Right Top',
  'right-bottom': 'Right Bottom',
  'center-top': 'Centre Top',
  'center-bottom': 'Centre Bottom',
};

export function PopupManager({ initialPopups }: { initialPopups: PopupDTO[] }) {
  const [popups, setPopups] = useState<PopupDTO[]>(initialPopups);
  const [editing, setEditing] = useState<'new' | PopupDTO | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function handleSaved(popup: PopupDTO) {
    setPopups((prev) => {
      const exists = prev.some((p) => p._id === popup._id);
      return exists ? prev.map((p) => (p._id === popup._id ? popup : p)) : [popup, ...prev];
    });
    setEditing(null);
    toast.success('Popup saved.');
  }

  async function toggleActive(popup: PopupDTO) {
    setBusyId(popup._id);
    try {
      const res = await fetch(`/api/admin/popups/${popup._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !popup.active }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        toast.error(json.error || 'Failed to update popup.');
        return;
      }
      setPopups((prev) => prev.map((p) => (p._id === popup._id ? json.popup : p)));
      toast.success(json.popup.active ? 'Popup is now active.' : 'Popup is now hidden.');
    } catch {
      toast.error('Network error — please try again.');
    } finally {
      setBusyId(null);
    }
  }

  async function deletePopup(popup: PopupDTO) {
    if (!window.confirm(`Delete "${popup.label}"? This can't be undone.`)) return;

    setBusyId(popup._id);
    try {
      const res = await fetch(`/api/admin/popups/${popup._id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        toast.error(json.error || 'Failed to delete popup.');
        return;
      }
      setPopups((prev) => prev.filter((p) => p._id !== popup._id));
      toast.success('Popup deleted.');
    } catch {
      toast.error('Network error — please try again.');
    } finally {
      setBusyId(null);
    }
  }

  if (editing) {
    return (
      <PopupForm
        popup={editing === 'new' ? null : editing}
        onSaved={handleSaved}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setEditing('new')}
          className="bg-slate-900 text-white text-sm px-5 py-2 rounded"
        >
          + Add Popup
        </button>
      </div>

      {popups.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded p-8 text-center text-slate-500">
          No popups yet. Click &ldquo;Add Popup&rdquo; to create one.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <Th>Image</Th>
                  <Th>Label</Th>
                  <Th>Position</Th>
                  <Th>Size</Th>
                  <Th>Button</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {popups.map((popup) => (
                  <tr key={popup._id} className="border-t border-slate-100 align-top">
                    <Td>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={popup.imageData}
                        alt={popup.label}
                        className="w-16 h-16 object-cover rounded border border-slate-200"
                      />
                    </Td>
                    <Td>
                      <div className="font-medium text-slate-900">{popup.label}</div>
                    </Td>
                    <Td>{POSITION_LABELS[popup.position]}</Td>
                    <Td>
                      {popup.width}×{popup.height}px
                    </Td>
                    <Td>{popup.buttonText ? `"${popup.buttonText}"` : '—'}</Td>
                    <Td>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${
                          popup.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {popup.active ? 'active' : 'hidden'}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setEditing(popup)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(popup)}
                          disabled={busyId === popup._id}
                          className="text-slate-600 hover:underline text-xs disabled:opacity-50"
                        >
                          {popup.active ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => deletePopup(popup)}
                          disabled={busyId === popup._id}
                          className="text-red-600 hover:underline text-xs disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 text-xs uppercase tracking-wide font-semibold">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-slate-700">{children}</td>;
}
