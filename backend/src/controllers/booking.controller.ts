import type { Request, Response, NextFunction } from 'express';
import * as bookingService from '../services/booking.service';
import { ApiError } from '../utils/apiError';
import { BookingStatus } from '../types/enums';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw ApiError.unauthorized();
    }
    const { serviceId, bookingDate, notes } = req.body;
    const booking = await bookingService.createBooking(userId, {
      serviceId,
      bookingDate: new Date(bookingDate),
      notes
    });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw ApiError.unauthorized();
    }
    const bookings = await bookingService.listBookingsForUser(userId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw ApiError.badRequest('Invalid booking ID');
    }
    const booking = await bookingService.getBookingById(id);
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    const isProvider = booking.providerId === userId;
    if (booking.userId !== userId && !isAdmin && !isProvider) {
      throw ApiError.forbidden('Access denied');
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const status = req.body.status as BookingStatus;
    if (Number.isNaN(id)) {
      throw ApiError.badRequest('Invalid booking ID');
    }
    if (!Object.values(BookingStatus).includes(status)) {
      throw ApiError.badRequest('Invalid status');
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
