import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/apiError';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing Authorization header'));
  }

  const token = header.substring('Bearer '.length);

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
}

