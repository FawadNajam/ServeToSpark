import type { Request, Response, NextFunction } from 'express';
import * as bookingService from '../services/booking.service';
import { ApiError } from '../utils/apiError';

/** Pending requests (no provider assigned) that this provider can accept */
export async function listRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const list = await bookingService.listPendingUnassignedBookings();
    res.json(list);
  } catch (err) {
    next(err);
  }
}

/** Bookings assigned to this provider */
export async function listMyBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const providerId = req.user?.id;
    if (!providerId) {
      throw ApiError.unauthorized();
    }
    const list = await bookingService.listBookingsForProvider(providerId);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function updateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const status = req.body.status;
    if (Number.isNaN(id)) {
      throw ApiError.badRequest('Invalid booking ID');
    }
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized();
    }
    const booking = await bookingService.updateBookingStatus(id, status, {
      id: user.id,
      role: user.role
    });
    res.json(booking);
  } catch (err) {
    next(err);
  }
}
