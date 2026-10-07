/**
 * Leads captured on the "Go for IPO" interactive page — triggered the
 * moment a visitor answers their first quiz question there.
 */
import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IIpoLead extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IpoLeadSchema = new Schema<IIpoLead>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, index: true },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    company: { type: String, trim: true, maxlength: 200 },
    role: { type: String, trim: true, maxlength: 100 },
  },
  { timestamps: true },
);

IpoLeadSchema.index({ createdAt: -1 });

export const IpoLead: Model<IIpoLead> =
  mongoose.models.IpoLead || mongoose.model<IIpoLead>('IpoLead', IpoLeadSchema);
