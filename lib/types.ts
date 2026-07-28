import type { PopupPosition } from '@/models/Popup';

export type { PopupPosition };

/** Client-side shape of a Popup document after JSON serialization. */
export interface PopupDTO {
  _id: string;
  label: string;
  imageData: string;
  orientation: 'portrait' | 'landscape';
  width: number;
  height: number;
  position: PopupPosition;
  buttonText?: string;
  buttonUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
