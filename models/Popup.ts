/**
 * Promotional popup schema.
 *
 * Images are compressed client-side (canvas resize + re-encode) before
 * upload and stored as a base64 data URI directly on the document — no
 * separate blob storage needed at this scale.
 */
import mongoose, { Schema, type Model, type Document } from 'mongoose';

export const POPUP_POSITIONS = [
  'left-top',
  'left-bottom',
  'right-top',
  'right-bottom',
  'center-top',
  'center-bottom',
] as const;

export type PopupPosition = (typeof POPUP_POSITIONS)[number];

export interface IPopup extends Document {
  label: string;
  imageData: string;
  orientation: 'portrait' | 'landscape';
  width: number;
  height: number;
  position: PopupPosition;
  buttonText?: string;
  buttonUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PopupSchema = new Schema<IPopup>(
  {
    label: { type: String, required: true, trim: true, maxlength: 100 },
    imageData: { type: String, required: true },
    orientation: { type: String, enum: ['portrait', 'landscape'], required: true },
    width: { type: Number, required: true, min: 50, max: 1600 },
    height: { type: Number, required: true, min: 50, max: 1600 },
    position: { type: String, enum: POPUP_POSITIONS, required: true, index: true },
    buttonText: { type: String, trim: true, maxlength: 50 },
    buttonUrl: { type: String, trim: true, maxlength: 500 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

PopupSchema.index({ active: 1, createdAt: -1 });

export const Popup: Model<IPopup> =
  mongoose.models.Popup || mongoose.model<IPopup>('Popup', PopupSchema);
