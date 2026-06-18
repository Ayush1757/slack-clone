import { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler =
  <T extends Request, U extends Response>(
    handler: (req: T, res: U, next: NextFunction) => Promise<void>,
  ): RequestHandler =>
  (req, res, next) => {
    void handler(req as T, res as U, next).catch(next);
  };
