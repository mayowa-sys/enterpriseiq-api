import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as auditService from '../services/audit.service';

export const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await auditService.getAuditLogs({
    orgId: req.user!.orgId as string,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 20,
    action: req.query.action as string,
    entity: req.query.entity as string,
  });

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

export const getAuditLogById = catchAsync(
  async (req: Request, res: Response) => {
    const log = await auditService.getAuditLogById(
      req.params.id,
      req.user!.orgId as string
    );

    res.status(200).json({
      status: 'success',
      data: { log },
    });
  }
);