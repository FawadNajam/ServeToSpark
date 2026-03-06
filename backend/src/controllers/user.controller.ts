import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { ApiError } from '../utils/apiError';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw ApiError.badRequest('Invalid user ID');
    }
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw ApiError.badRequest('Invalid user ID');
    }
    const currentUserId = req.user?.id;
    if (currentUserId !== id && req.user?.role !== 'admin') {
      throw ApiError.forbidden('You can only update your own profile');
    }
    const user = await userService.updateUser(id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
