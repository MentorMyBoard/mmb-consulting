import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  source?: string;
  unsubscribed: boolean;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 254,
    },
    source: { type: String, maxlength: 100 },
    unsubscribed: { type: Boolean, default: false },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true },
);

export const Newsletter: Model<INewsletter> =
  mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
