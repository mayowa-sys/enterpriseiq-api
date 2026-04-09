import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as analyticsService from '../services/analytics.service';

export const getPeakHours = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsService.getPeakHours(req.user!.orgId as string);
  res.status(200).json({ status: 'success', data });
});

export const getNoShowRate = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsService.getNoShowRate(req.user!.orgId as string);
  res.status(200).json({ status: 'success', data });
});

export const getStaffUtilisation = catchAsync(
  async (req: Request, res: Response) => {
    const data = await analyticsService.getStaffUtilisation(
      req.user!.orgId as string,
      req.query.startDate as string,
      req.query.endDate as string
    );
    res.status(200).json({ status: 'success', data });
  }
);

export const getVolumeTrend = catchAsync(
  async (req: Request, res: Response) => {
    const data = await analyticsService.getVolumeTrend(
      req.user!.orgId as string
    );
    res.status(200).json({ status: 'success', data });
  }
);

export const getRevenueEstimate = catchAsync(
  async (req: Request, res: Response) => {
    const data = await analyticsService.getRevenueEstimate(
      req.user!.orgId as string
    );
    res.status(200).json({ status: 'success', data });
  }
);

export const getSummary = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsService.getSummary(req.user!.orgId as string);
  res.status(200).json({ status: 'success', data });
});