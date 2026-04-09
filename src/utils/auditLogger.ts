import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog';

interface AuditLogParams {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'appointment' | 'user' | 'organisation';
  entityId: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

const auditLogger = async (params: AuditLogParams): Promise<void> => {
  try {
    await AuditLog.create({
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      performedBy: params.performedBy,
      orgId: params.orgId,
      changes: {
        before: params.before || {},
        after: params.after || {},
      },
    });
  } catch (error) {
    // Audit logging should never crash the main application
    console.error('Audit log failed:', error);
  }
};

export default auditLogger;