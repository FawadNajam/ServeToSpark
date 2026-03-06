import type { Request, Response, NextFunction } from 'express';
import * as serviceCatalog from '../services/serviceCatalog.service';
import { ApiError } from '../utils/apiError';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const services = await serviceCatalog.listServices(categoryId);
    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw ApiError.badRequest('Invalid service ID');
    }
    const service = await serviceCatalog.getServiceById(id);
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const service = await serviceCatalog.createService(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw ApiError.badRequest('Invalid service ID');
    }
    const service = await serviceCatalog.updateService(id, req.body);
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw ApiError.badRequest('Invalid service ID');
    }
    await serviceCatalog.deleteService(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
