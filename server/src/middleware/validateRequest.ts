import { NextFunction, Request, RequestHandler, Response } from 'express';
import { z } from 'zod';

import { AppError } from '../utils/AppError';

type RequestSource = 'body' | 'params' | 'query';

export const validateRequest =
  <T extends z.ZodTypeAny>(schema: T, source: RequestSource = 'body'): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      next(new AppError(result.error.issues.map((issue) => issue.message).join(', '), 400));
      return;
    }

    if (source === 'body') {
      req.body = result.data as Record<string, unknown>;
    }

    next();
  };
