import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { z } from 'zod';

import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/token';

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  avatar: z.string().url().optional().or(z.literal('')).default(''),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerInputSchema = registerSchema;
export const loginInputSchema = loginSchema;

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, avatar } = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  res.status(201).json({
    success: true,
    token: signToken(user.id),
    user: user.toJSON(),
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  res.status(200).json({
    success: true,
    token: signToken(user.id),
    user: user.toJSON(),
  });
};

export const profile = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authenticated user not available', 401);
  }

  res.status(200).json({
    success: true,
    user: req.user.toJSON(),
  });
};
