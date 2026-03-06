import { body, param } from 'express-validator';

export const createBookingValidator = [
  body('serviceId').isInt({ min: 1 }).withMessage('Valid serviceId required'),
  body('bookingDate').isISO8601().withMessage('Valid bookingDate (ISO 8601) required'),
  body('notes').optional().trim().isLength({ max: 2000 })
];

export const bookingIdParam = [param('id').isInt({ min: 1 }).withMessage('Valid booking ID required')];

export const updateStatusValidator = [
  param('id').isInt({ min: 1 }).withMessage('Valid booking ID required'),
  body('status')
    .isIn(['pending', 'accepted', 'rejected', 'completed', 'cancelled'])
    .withMessage('Valid status required')
];
