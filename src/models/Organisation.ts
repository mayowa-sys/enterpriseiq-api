import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganisation extends Document {
  name: string;
  slug: string;
  industry: 'banking' | 'healthcare' | 'telecom' | 'general';
  status: 'active' | 'suspended' | 'deleted';
  settings: {
    workingHours: {
      start: string;
      end: string;
    };
    timezone: string;
    appointmentTypes: Array<{
      name: string;
      durationMinutes: number;
      priceNaira: number;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganisationSchema = new Schema<IOrganisation>(
  {
    name: {
      type: String,
      required: [true, 'Organisation name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    industry: {
      type: String,
      enum: ['banking', 'healthcare', 'telecom', 'general'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
    },
    settings: {
      workingHours: {
        start: { type: String, default: '08:00' },
        end: { type: String, default: '17:00' },
      },
      timezone: { type: String, default: 'Africa/Lagos' },
      appointmentTypes: [
        {
          name: { type: String, required: true },
          durationMinutes: { type: Number, required: true },
          priceNaira: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrganisation>('Organisation', OrganisationSchema);