import { User, Booking, Service, Role } from '../models';
import { RoleName, BookingStatus } from '../types/enums';

export interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalServices: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [userRole, providerRole, totalServices, totalBookings, pendingBookings, completedBookings] =
    await Promise.all([
      Role.findOne({ where: { name: RoleName.USER } }),
      Role.findOne({ where: { name: RoleName.PROVIDER } }),
      Service.count(),
      Booking.count(),
      Booking.count({ where: { status: BookingStatus.PENDING } }),
      Booking.count({ where: { status: BookingStatus.COMPLETED } })
    ]);

  const totalUsers = userRole ? await User.count({ where: { roleId: userRole.id } }) : 0;
  const totalProviders = providerRole ? await User.count({ where: { roleId: providerRole.id } }) : 0;

  return {
    totalUsers,
    totalProviders,
    totalServices,
    totalBookings,
    pendingBookings,
    completedBookings
  };
}
