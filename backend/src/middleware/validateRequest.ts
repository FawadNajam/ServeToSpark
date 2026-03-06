import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError';

export function validateRequest(req: Request, _res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(ApiError.badRequest('Validation failed', errors.array()));
    return;
  }
  next();
}

