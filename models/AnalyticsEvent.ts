/**
 * Lightweight analytics: page views and promo-popup clicks.
 * Deliberately minimal — no visitor identity, just counts over time.
 */
import mongoose, { Schema, type Model, type Document } from 'mongoose';

export type AnalyticsEventType = 'page_view' | 'popup_click';

export interface IAnalyticsEvent extends Document {
  type: AnalyticsEventType;
  popupId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    type: { type: String, enum: ['page_view', 'popup_click'], required: true, index: true },
    popupId: { type: Schema.Types.ObjectId, ref: 'Popup' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

AnalyticsEventSchema.index({ type: 1, popupId: 1 });

export const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
