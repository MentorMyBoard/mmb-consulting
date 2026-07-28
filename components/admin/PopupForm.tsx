'use client';

import { useState } from 'react';
import { popupCreateSchema, popupUpdateSchema, popupPositions } from '@/lib/validations';
import type { PopupDTO, PopupPosition } from '@/lib/types';

const POSITION_LABELS: Record<PopupPosition, string> = {
  'left-top': 'Left Top',
  'left-bottom': 'Left Bottom',
  'right-top': 'Right Top',
  'right-bottom': 'Right Bottom',
  'center-top': 'Centre Top',
  'center-bottom': 'Centre Bottom',
};

/** Max dimension (px) an uploaded image is downscaled to before encoding. */
const MAX_IMAGE_DIMENSION = 1600;
const WEBP_QUALITY = 0.82;

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the compressed image.'));
    reader.readAsDataURL(blob);
  });
}

async function compressImageFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    const scale = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser does not support image compression.');
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Image compression failed.'))),
      'image/webp',
      WEBP_QUALITY,
    );
  });

  return blobToDataUri(blob);
}

type FormState = {
  label: string;
  imageData: string;
  orientation: 'portrait' | 'landscape' | '';
  width: string;
  height: string;
  position: PopupPosition | '';
  buttonText: string;
  buttonUrl: string;
  active: boolean;
};

function initialState(popup: PopupDTO | null): FormState {
  return {
    label: popup?.label ?? '',
    imageData: popup?.imageData ?? '',
    orientation: popup?.orientation ?? '',
    width: popup ? String(popup.width) : '',
    height: popup ? String(popup.height) : '',
    position: popup?.position ?? '',
    buttonText: popup?.buttonText ?? '',
    buttonUrl: popup?.buttonUrl ?? '',
    active: popup?.active ?? true,
  };
}

export function PopupForm({
  popup,
  onSaved,
  onCancel,
}: {
  popup: PopupDTO | null;
  onSaved: (popup: PopupDTO) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => initialState(popup));
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const isEdit = !!popup;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(['Please choose an image file.']);
      return;
    }

    setCompressing(true);
    setErrors([]);
    try {
      const dataUri = await compressImageFile(file);
      setForm((f) => ({ ...f, imageData: dataUri }));
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Could not process that image.']);
    } finally {
      setCompressing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    const payload = {
      label: form.label,
      imageData: form.imageData || undefined,
      orientation: form.orientation || undefined,
      width: form.width,
      height: form.height,
      position: form.position || undefined,
      buttonText: form.buttonText,
      buttonUrl: form.buttonUrl,
      active: form.active,
    };

    const schema = isEdit ? popupUpdateSchema : popupCreateSchema;
    const result = schema.safeParse(payload);

    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }

    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/popups/${popup!._id}` : '/api/admin/popups';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setErrors([json.error || 'Something went wrong while saving.']);
        return;
      }

      onSaved(json.popup as PopupDTO);
    } catch {
      setErrors(['Network error — please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded p-6 space-y-5">
      <h2 className="text-lg font-serif text-slate-900">{isEdit ? 'Edit Popup' : 'Add Popup'}</h2>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3 space-y-1">
          {errors.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-xs uppercase tracking-wide font-semibold text-slate-600 mb-1">
          Internal label
        </label>
        <input
          type="text"
          value={form.label}
          onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          placeholder="e.g. Summer Webinar Promo"
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide font-semibold text-slate-600 mb-1">
          Image
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
        {compressing && <p className="text-xs text-slate-500 mt-1">Compressing image…</p>}
        {form.imageData && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-1">Live preview</p>
            {/* Live preview of the compressed upload — data URI, not eligible for next/image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.imageData}
              alt="Popup preview"
              className="max-w-[240px] max-h-[240px] border border-slate-200 rounded object-contain"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide font-semibold text-slate-600 mb-1">
          Image orientation
        </label>
        <div className="flex gap-4 text-sm">
          {(['portrait', 'landscape'] as const).map((o) => (
            <label key={o} className="flex items-center gap-2">
              <input
                type="radio"
                name="orientation"
                checked={form.orientation === o}
                onChange={() => setForm((f) => ({ ...f, orientation: o }))}
              />
              <span className="capitalize">{o}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wide font-semibold text-slate-600 mb-1">
            Width (px)
          </label>
          <input
            type="number"
            value={form.width}
            onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide font-semibold text-slate-600 mb-1">
            Height (px)
          </label>
          <input
            type="number"
            value={form.height}
            onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide font-semibold text-slate-600 mb-1">
          Position on screen
        </label>
        <select
          value={form.position}
          onChange={(e) => setForm((f) => ({ ...f, position: e.target.value as PopupPosition }))}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white"
        >
          <option value="">Select a position…</option>
          {popupPositions.map((p) => (
            <option key={p} value={p}>
              {POSITION_LABELS[p]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wide font-semibold text-slate-600 mb-1">
            Button text (optional)
          </label>
          <input
            type="text"
            value={form.buttonText}
            onChange={(e) => setForm((f) => ({ ...f, buttonText: e.target.value }))}
            placeholder="Learn More"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide font-semibold text-slate-600 mb-1">
            Button URL (optional)
          </label>
          <input
            type="text"
            value={form.buttonUrl}
            onChange={(e) => setForm((f) => ({ ...f, buttonUrl: e.target.value }))}
            placeholder="https://…"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
        />
        Active (visible on the public site)
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || compressing}
          className="bg-slate-900 text-white text-sm px-5 py-2 rounded disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save Popup'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-slate-300 text-slate-700 text-sm px-5 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
