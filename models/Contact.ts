/**
 * Contact form submission schema.
 *
 * `status` is workflow state for the admin team:
 *   new        — fresh, untouched
 *   in_review  — someone has read it
 *   responded  — first reply sent
 *   closed     — resolved
 *   spam       — flagged, not actioned
 */
import mongoose, { Schema, type Model, type Document } from 'mongoose';

export type ContactStatus = 'new' | 'in_review' | 'responded' | 'closed' | 'spam';

export interface IContact extends Document {
  name: string;
  email: string;
  company: string;
  phone: string;
  requirement: string;
  message: string;
  status: ContactStatus;
  ipAddress?: string;
  userAgent?: string;
  emailNotificationSent: boolean;
  emailConfirmationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, index: true },
    company: { type: String, required: true, trim: true, maxlength: 200 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    requirement: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ['new', 'in_review', 'responded', 'closed', 'spam'],
      default: 'new',
      index: true,
    },
    ipAddress: { type: String, maxlength: 45 },
    userAgent: { type: String, maxlength: 500 },
    emailNotificationSent: { type: Boolean, default: false },
    emailConfirmationSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Useful indexes for the admin view.
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1, createdAt: -1 });

export const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
