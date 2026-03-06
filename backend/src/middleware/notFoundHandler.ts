import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound('Route not found'));
}

