import { ErrorRequestHandler, Request, Response } from 'express';

import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export const notFoundHandler = (_req: Request, _res: Response, next: (err?: unknown) => void): void => {
  next(new AppError('Route not found', 404));
};

export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' ? { stack: err instanceof Error ? err.stack : undefined } : {}),
  });
};
