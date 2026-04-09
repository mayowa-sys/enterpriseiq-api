import AuditLog, { IAuditLog } from '../models/AuditLog';
import AppError from '../utils/AppError';
import mongoose from 'mongoose';

interface GetAuditLogsParams {
  orgId: string;
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
}

interface PaginatedAuditLogs {
  logs: IAuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAuditLogs = async (
  params: GetAuditLogsParams
): Promise<PaginatedAuditLogs> => {
  const { orgId, page = 1, limit = 20, action, entity } = params;

  const query: Record<string, unknown> = {
    orgId: new mongoose.Types.ObjectId(orgId),
  };

  if (action) query.action = action;
  if (entity) query.entity = entity;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate('performedBy', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments(query),
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getAuditLogById = async (
  id: string,
  orgId: string
): Promise<IAuditLog> => {
  const log = await AuditLog.findOne({
    _id: id,
    orgId: new mongoose.Types.ObjectId(orgId),
  }).populate('performedBy', 'firstName lastName email');

  if (!log) throw new AppError('Audit log not found.', 404);
  return log;
};