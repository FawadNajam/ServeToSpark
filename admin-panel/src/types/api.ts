export interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalServices: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  roleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  createdAt: string;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

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

