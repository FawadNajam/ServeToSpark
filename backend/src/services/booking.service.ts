import { Booking, User, Service } from '../models';
import { BookingStatus } from '../types/enums';
import { ApiError } from '../utils/apiError';

export interface BookingDto {
  id: number;
  userId: number;
  serviceId: number;
  providerId: number | null;
  bookingDate: string;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
  user?: { id: number; name: string; email: string };
  service?: { id: number; name: string; price: number };
  provider?: { id: number; name: string } | null;
}

function toDto(booking: Booking & { user?: User; service?: Service; provider?: User | null }): BookingDto {
  const b = booking.get();
  return {
    ...b,
    bookingDate: (b.bookingDate as Date).toISOString(),
    createdAt: (b.createdAt as Date).toISOString(),
    user: booking.user ? { id: booking.user.id, name: booking.user.name, email: booking.user.email } : undefined,
    service: booking.service
      ? { id: booking.service.id, name: booking.service.name, price: Number(booking.service.price) }
      : undefined,
    provider: booking.provider
      ? { id: booking.provider.id, name: booking.provider.name }
      : null
  };
}

export interface CreateBookingInput {
  serviceId: number;
  bookingDate: Date;
  notes?: string;
}

export async function createBooking(userId: number, input: CreateBookingInput): Promise<BookingDto> {
  const service = await Service.findByPk(input.serviceId);
  if (!service) {
    throw ApiError.badRequest('Service not found');
  }
  const booking = await Booking.create({
    userId,
    serviceId: input.serviceId,
    providerId: null,
    bookingDate: input.bookingDate,
    status: BookingStatus.PENDING,
    notes: input.notes ?? null
  });
  return getBookingById(booking.id);
}

export async function getBookingById(id: number): Promise<BookingDto> {
  const booking = await Booking.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
      { model: User, as: 'provider', attributes: ['id', 'name'], required: false }
    ]
  });
  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }
  return toDto(booking as Booking & { user?: User; service?: Service; provider?: User | null });
}

export async function listBookingsForUser(userId: number): Promise<BookingDto[]> {
  const list = await Booking.findAll({
    where: { userId },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
      { model: User, as: 'provider', attributes: ['id', 'name'], required: false }
    ],
    order: [['bookingDate', 'DESC']]
  });
  return list.map((b) => toDto(b as Booking & { user?: User; service?: Service; provider?: User | null }));
}

/** Pending requests with no provider (for any provider to accept) */
export async function listPendingUnassignedBookings(): Promise<BookingDto[]> {
  const list = await Booking.findAll({
    where: { status: BookingStatus.PENDING, providerId: null },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
      { model: User, as: 'provider', attributes: ['id', 'name'], required: false }
    ],
    order: [['bookingDate', 'ASC']]
  });
  return list.map((b) => toDto(b as Booking & { user?: User; service?: Service; provider?: User | null }));
}

/** Bookings assigned to this provider (my jobs) */
export async function listBookingsForProvider(providerId: number): Promise<BookingDto[]> {
  const list = await Booking.findAll({
    where: { providerId },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
      { model: User, as: 'provider', attributes: ['id', 'name'], required: false }
    ],
    order: [['bookingDate', 'DESC']]
  });
  return list.map((b) => toDto(b as Booking & { user?: User; service?: Service; provider?: User | null }));
}

export async function listAllBookings(): Promise<BookingDto[]> {
  const list = await Booking.findAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
      { model: User, as: 'provider', attributes: ['id', 'name'], required: false }
    ],
    order: [['createdAt', 'DESC']]
  });
  return list.map((b) => toDto(b as Booking & { user?: User; service?: Service; provider?: User | null }));
}

const allowedStatusTransitions: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.ACCEPTED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
  [BookingStatus.ACCEPTED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  [BookingStatus.REJECTED]: [],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: []
};

export async function updateBookingStatus(
  bookingId: number,
  newStatus: BookingStatus,
  actor: { role: string; id: number }
): Promise<BookingDto> {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  const current = booking.status as BookingStatus;
  const allowed = allowedStatusTransitions[current];
  if (!allowed?.includes(newStatus)) {
    throw ApiError.badRequest(`Cannot transition from ${current} to ${newStatus}`);
  }

  if (newStatus === BookingStatus.ACCEPTED && actor.role === 'provider') {
    await booking.update({ status: newStatus, providerId: actor.id });
  } else {
    await booking.update({ status: newStatus });
  }

  return getBookingById(bookingId);
}

