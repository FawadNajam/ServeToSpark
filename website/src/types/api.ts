export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ServiceDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category?: { name: string };
  createdAt?: string;
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

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  roleId: number;
  role?: { name: string };
  createdAt: string;
  updatedAt: string;
}
