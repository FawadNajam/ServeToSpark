'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@services/apiClient';
import type { ServiceDto } from '@types/api';
import { Header } from '@components/Header';
import { useAuth } from '@hooks/useAuth';

async function fetchService(id: number): Promise<ServiceDto> {
  const { data } = await apiClient.get<ServiceDto>(`/services/${id}`);
  return data;
}

export default function BookServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const serviceId = Number(searchParams.get('serviceId'));
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');

  const { data: service, isLoading: loadingService } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => fetchService(serviceId),
    enabled: !!serviceId && !Number.isNaN(serviceId)
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      const dateTime = `${bookingDate}T${bookingTime}:00.000Z`;
      await apiClient.post('/bookings', {
        serviceId,
        bookingDate: dateTime,
        notes: notes.trim() || undefined
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      router.push('/bookings');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?redirect=/book?serviceId=' + serviceId);
      return;
    }
    if (!bookingDate || !bookingTime) return;
    bookMutation.mutate();
  };

  if (!serviceId || Number.isNaN(serviceId)) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-red-600">Select a service first.</p>
          <Link href="/services" className="mt-2 inline-block text-brand-600 hover:underline">
            Browse services
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Book service</h1>
        {loadingService && <p className="mt-2 text-slate-500">Loading…</p>}
        {service && (
          <p className="mt-1 text-slate-600">
            {service.name} — ${Number(service.price).toFixed(2)}
          </p>
        )}
        {!user && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Please log in to book. You will be redirected after signing in.
          </p>
        )}
        <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Time</label>
            <input
              type="time"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Notes (optional)</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Any special instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {bookMutation.isError && (
            <p className="text-sm text-red-600">
              {(bookMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Booking failed.'}
            </p>
          )}
          <button
            type="submit"
            disabled={!user || bookMutation.isPending}
            className="btn-primary w-full"
          >
            {bookMutation.isPending ? 'Booking…' : 'Confirm booking'}
          </button>
        </form>
      </main>
    </>
  );
}
