import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';
import type { RoleName } from '../types/enums';

export function authorize(...allowedRoles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden());
    }

    return next();
  };
}

