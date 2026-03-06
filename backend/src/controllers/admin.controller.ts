import type { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';
import * as userService from '../services/user.service';
import * as bookingService from '../services/booking.service';

export async function dashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

export async function listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function listBookings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const bookings = await bookingService.listAllBookings();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}
