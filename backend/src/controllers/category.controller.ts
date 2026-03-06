import type { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await categoryService.listCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name } = req.body;
    const category = await categoryService.createCategory(name);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}
