import { Request } from 'express';
export type AccessTokenPayload = {
  sub: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
};

export type AccountPayload = {
  userId: string;
  email?: string;
  role?: string;
};

export type AuthRequest = Request & { user: AccountPayload };
