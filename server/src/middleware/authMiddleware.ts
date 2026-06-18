import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { JwtPayload } from '../utils/token';

const extractToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      next(new AppError('Authorization token is required', 401));
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.sub).select('-password');

    if (!user) {
      next(new AppError('Authenticated user not found', 401));
      return;
    }

    req.user = user;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};
