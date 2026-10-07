'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { IpoLeadDTO } from '@/lib/types';

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function exportToCsv(leads: IpoLeadDTO[]) {
  const header = ['Date', 'Name', 'Email', 'Phone', 'Company', 'Role'];
  const rows = leads.map((lead) => [
    new Date(lead.createdAt).toLocaleString('en-IN'),
    lead.name,
    lead.email,
    lead.phone,
    lead.company || '',
    lead.role || '',
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n');
  // Leading BOM so Excel detects UTF-8 correctly instead of mis-decoding it.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `go-for-ipo-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function IpoLeadsManager({ initialLeads }: { initialLeads: IpoLeadDTO[] }) {
  const [leads, setLeads] = useState<IpoLeadDTO[]>(initialLeads);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function deleteLead(lead: IpoLeadDTO) {
    if (!window.confirm(`Delete the lead for "${lead.name}"? This can't be undone.`)) return;

    setBusyId(lead._id);
    try {
      const res = await fetch(`/api/admin/ipo-leads/${lead._id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        toast.error(json.error || 'Failed to delete lead.');
        return;
      }
      setLeads((prev) => prev.filter((l) => l._id !== lead._id));
      toast.success('Lead deleted.');
    } catch {
      toast.error('Network error — please try again.');
    } finally {
      setBusyId(null);
    }
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded p-8 text-center text-slate-500">
        No leads captured yet.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => exportToCsv(leads)}
          className="border border-slate-300 text-slate-700 text-sm px-4 py-2 rounded hover:bg-slate-50"
        >
          Export to Excel (CSV)
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <Th>Date</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Company</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-t border-slate-100 align-top">
                  <Td>
                    {new Date(lead.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </Td>
                  <Td>
                    <div className="font-medium text-slate-900">{lead.name}</div>
                  </Td>
                  <Td>
                    <a className="text-blue-600 hover:underline" href={`mailto:${lead.email}`}>
                      {lead.email}
                    </a>
                  </Td>
                  <Td>{lead.phone}</Td>
                  <Td>{lead.company || '—'}</Td>
                  <Td>{lead.role || '—'}</Td>
                  <Td>
                    <button
                      onClick={() => deleteLead(lead)}
                      disabled={busyId === lead._id}
                      className="text-red-600 hover:underline text-xs disabled:opacity-50"
                    >
                      {busyId === lead._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
