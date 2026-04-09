import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as userService from '../services/user.service';

export const createStaff = catchAsync(async (req: Request, res: Response) => {
  const orgId = req.user!.orgId as string;

  const user = await userService.createUserInOrg(orgId, req.body, 'staff');

  res.status(201).json({
    status: 'success',
    message: 'Staff member created successfully',
    data: { user },
  });
});

export const createClient = catchAsync(async (req: Request, res: Response) => {
  const orgId = req.user!.orgId as string;

  const user = await userService.createUserInOrg(orgId, req.body, 'client');

  res.status(201).json({
    status: 'success',
    message: 'Client registered successfully',
    data: { user },
  });
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const orgId = req.user!.orgId as string;

  const users = await userService.getUsersInOrg(orgId);

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const orgId = req.user!.orgId as string;

  const user = await userService.getUserById(req.params.id, orgId);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

export const deactivateUser = catchAsync(
  async (req: Request, res: Response) => {
    const orgId = req.user!.orgId as string;

    await userService.deactivateUser(req.params.id, orgId);

    res.status(200).json({
      status: 'success',
      message: 'User deactivated successfully',
    });
  }
);