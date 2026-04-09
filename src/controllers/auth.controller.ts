import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as authService from '../services/auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const result = await authService.registerUser({
    firstName,
    lastName,
    email,
    password,
  });

  res.status(201).json({
    status: 'success',
    message: 'Account created successfully',
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.loginUser(email, password);

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: result,
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.userId);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});