import { body, param, query } from 'express-validator';

export const createServiceValidator = [
  body('name').trim().notEmpty().isLength({ max: 150 }),
  body('description').trim().notEmpty(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').isInt({ min: 1 }).withMessage('Valid categoryId required')
];

export const updateServiceValidator = [
  param('id').isInt({ min: 1 }).withMessage('Valid service ID required'),
  body('name').optional().trim().notEmpty().isLength({ max: 150 }),
  body('description').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('categoryId').optional().isInt({ min: 1 })
];

export const serviceIdParam = [param('id').isInt({ min: 1 }).withMessage('Valid service ID required')];

export const listServicesQuery = [
  query('categoryId').optional().isInt({ min: 1 }).withMessage('categoryId must be a positive integer')
];
