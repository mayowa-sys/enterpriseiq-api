import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface TokenPayload {
  userId: string;
  role: string;
  orgId: string | null;
}

// ── Access Token ───────────────────────────────────────────────
export const signAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  return jwt.verify(token, secret) as TokenPayload;
};

// ── Refresh Token ──────────────────────────────────────────────
export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};