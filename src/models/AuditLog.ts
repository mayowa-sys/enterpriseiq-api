import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  orgId: mongoose.Types.ObjectId;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'appointment' | 'user' | 'organisation';
  entityId: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  changes: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  orgId: {
    type: Schema.Types.ObjectId,
    ref: 'Organisation',
    required: true,
  },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
    required: true,
  },
  entity: {
    type: String,
    enum: ['appointment', 'user', 'organisation'],
    required: true,
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  changes: {
    before: { type: Schema.Types.Mixed, default: {} },
    after: { type: Schema.Types.Mixed, default: {} },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for sorted log retrieval
AuditLogSchema.index({ orgId: 1, timestamp: -1 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);