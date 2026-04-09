import crypto from 'crypto';
import User, { IUser } from '../models/User';
import RefreshToken from '../models/RefreshToken';
import AppError from '../utils/AppError';
import { signAccessToken, generateRefreshToken } from '../utils/token';

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}

export const registerUser = async (
  params: RegisterParams
): Promise<AuthResponse> => {
  const { firstName, lastName, email, password } = params;

  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('An account with this email already exists.', 400);
  }

  // Create user — password gets hashed by the pre-save hook
  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash: password,
    role: 'client',
  });

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    orgId: user.orgId ? user.orgId.toString() : null,
  });

  const refreshTokenValue = generateRefreshToken();

  await RefreshToken.create({
    userId: user._id,
    token: crypto.createHash('sha256').update(refreshTokenValue).digest('hex'),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Never return the password hash
  const userResponse = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  return { user: userResponse, accessToken, refreshToken: refreshTokenValue };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    orgId: user.orgId ? user.orgId.toString() : null,
  });

  const refreshTokenValue = generateRefreshToken();

  await RefreshToken.create({
    userId: user._id,
    token: crypto.createHash('sha256').update(refreshTokenValue).digest('hex'),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const userResponse = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    orgId: user.orgId,
  };

  return { user: userResponse, accessToken, refreshToken: refreshTokenValue };
};

export const getMe = async (userId: string): Promise<Partial<IUser>> => {
  const user = await User.findById(userId).select(
    '-passwordHash'
  );
  if (!user) throw new AppError('User not found.', 404);
  return user;
};