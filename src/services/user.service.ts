import mongoose from 'mongoose';
import User, { IUser, UserRole } from '../models/User';
import AppError from '../utils/AppError';

export const createUserInOrg = async (
  orgId: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  },
  role: UserRole
): Promise<Partial<IUser>> => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new AppError('An account with this email already exists.', 400);
  }

  const user = await User.create({
    orgId: new mongoose.Types.ObjectId(orgId),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash: data.password,
    role,
  });

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    orgId: user.orgId,
  };
};

export const getUsersInOrg = async (orgId: string): Promise<Partial<IUser>[]> => {
  return User.find({ orgId, isActive: true })
    .select('-passwordHash')
    .sort({ createdAt: -1 });
};

export const getUserById = async (
  userId: string,
  orgId: string
): Promise<Partial<IUser>> => {
  const user = await User.findOne({
    _id: userId,
    orgId,
  }).select('-passwordHash');

  if (!user) {
    throw new AppError('User not found in your organisation.', 404);
  }

  return user;
};

export const deactivateUser = async (
  userId: string,
  orgId: string
): Promise<void> => {
  const user = await User.findOneAndUpdate(
    { _id: userId, orgId },
    { isActive: false },
    { new: true }
  );

  if (!user) {
    throw new AppError('User not found in your organisation.', 404);
  }
};