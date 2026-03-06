import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      details: err.details ?? null
    });
    return;
  }

  // eslint-disable-next-line no-console
  console.error('Unexpected error', err);

  res.status(500).json({
    message: 'Internal Server Error'
  });
}

