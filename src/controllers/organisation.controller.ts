import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as orgService from '../services/organisation.service';

export const createOrganisation = catchAsync(
  async (req: Request, res: Response) => {
    const org = await orgService.createOrganisation(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: { organisation: org },
    });
  }
);

export const getAllOrganisations = catchAsync(
  async (req: Request, res: Response) => {
    const organisations = await orgService.getAllOrganisations();

    res.status(200).json({
      status: 'success',
      data: { organisations },
    });
  }
);

export const getOrganisationById = catchAsync(
  async (req: Request, res: Response) => {
    const org = await orgService.getOrganisationById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { organisation: org },
    });
  }
);

export const updateOrganisation = catchAsync(
  async (req: Request, res: Response) => {
    const org = await orgService.updateOrganisation(
      req.params.id,
      req.user!.orgId as string,
      req.body
    );

    res.status(200).json({
      status: 'success',
      message: 'Organisation updated successfully',
      data: { organisation: org },
    });
  }
);

export const suspendOrganisation = catchAsync(
  async (req: Request, res: Response) => {
    const org = await orgService.suspendOrganisation(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Organisation suspended successfully',
      data: { organisation: org },
    });
  }
);