/**
 * Singleton settings document for the "Go for IPO" page — currently just
 * the destination URL for the post-quiz "Consult Now" CTA, admin-editable
 * so it can be changed without a deploy.
 */
import mongoose, { Schema, type Model, type Document } from 'mongoose';

export const IPO_SETTINGS_ID = 'ipo-settings';

export interface IIpoSettings extends Document<string> {
  consultNowUrl: string;
  updatedAt: Date;
}

const IpoSettingsSchema = new Schema<IIpoSettings>(
  {
    _id: { type: String, default: IPO_SETTINGS_ID },
    consultNowUrl: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true },
);

export const IpoSettings: Model<IIpoSettings> =
  mongoose.models.IpoSettings || mongoose.model<IIpoSettings>('IpoSettings', IpoSettingsSchema);
