'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { apiClient } from '@services/apiClient';
import type { BookingDto } from '@types/api';
import { Header } from '@components/Header';
import { useAuth } from '@hooks/useAuth';

async function fetchBookings(): Promise<BookingDto[]> {
  const { data } = await apiClient.get<BookingDto[]>('/bookings');
  return data;
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-slate-100 text-slate-600'
};

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
    enabled: !!user
  });

  useEffect(() => {
    if (user === null) {
      router.replace('/login?redirect=/bookings');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="mt-1 text-slate-600">Track your service requests.</p>
        {isLoading && <p className="mt-6 text-slate-500">Loading…</p>}
        {isError && <p className="mt-6 text-red-600">Failed to load bookings.</p>}
        {bookings && bookings.length === 0 && (
          <div className="card mt-6 p-8 text-center">
            <p className="text-slate-500">You have no bookings yet.</p>
            <Link href="/services" className="btn-primary mt-4 inline-block">
              Browse services
            </Link>
          </div>
        )}
        {bookings && bookings.length > 0 && (
          <div className="mt-6 space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="card p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-slate-900">{b.service?.name ?? `Service #${b.serviceId}`}</h2>
                    <p className="text-sm text-slate-500">
                      {new Date(b.bookingDate).toLocaleString()} · {b.provider?.name ?? 'Awaiting provider'}
                    </p>
                    {b.notes && <p className="mt-1 text-sm text-slate-600">{b.notes}</p>}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[b.status] ?? 'bg-slate-100 text-slate-600'}`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
