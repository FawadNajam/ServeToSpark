import { body, param } from 'express-validator';

export const updateUserValidator = [
  param('id').isInt({ min: 1 }).withMessage('Valid user ID required'),
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('phone').optional().trim().isLength({ max: 50 })
];

export const userIdParam = [param('id').isInt({ min: 1 }).withMessage('Valid user ID required')];
