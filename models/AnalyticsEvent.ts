/**
 * Lightweight analytics: page views (per path), promo-popup clicks, and
 * form submissions. Deliberately minimal — no visitor identity, just
 * counts over time.
 */
import mongoose, { Schema, type Model, type Document } from 'mongoose';

export type AnalyticsEventType = 'page_view' | 'popup_click' | 'form_submit';

export interface IAnalyticsEvent extends Document {
  type: AnalyticsEventType;
  popupId?: mongoose.Types.ObjectId;
  path?: string;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    type: { type: String, enum: ['page_view', 'popup_click', 'form_submit'], required: true, index: true },
    popupId: { type: Schema.Types.ObjectId, ref: 'Popup' },
    path: { type: String, trim: true, maxlength: 200, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

AnalyticsEventSchema.index({ type: 1, popupId: 1 });
AnalyticsEventSchema.index({ type: 1, path: 1 });

export const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
