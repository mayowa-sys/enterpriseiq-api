import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';
import AppError from '../utils/AppError';

const authorise = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('You are not logged in.', 401));
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
};

export default authorise;