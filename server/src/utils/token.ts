import jwt from 'jsonwebtoken';

import { env } from '../config/env';

export interface JwtPayload {
  sub: string;
}

export const signToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, env.JWT_SECRET as jwt.Secret, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  } as jwt.SignOptions);
};
