"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';
import type { BookingDto, BookingStatus } from '../../types/api';
import { AdminLayoutShell } from '@components/layout/AdminLayout';

async function fetchBookings(): Promise<BookingDto[]> {
  const res = await apiClient.get('/admin/bookings');
  return res.data as BookingDto[];
}

const statusOptions: BookingStatus[] = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];

export default function BookingsPage(): JSX.Element {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: fetchBookings
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: BookingStatus }) => {
      await apiClient.patch(`/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] }).catch(() => {});
    }
  });

  return (
    <AdminLayoutShell>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Bookings</h2>
          <p className="text-sm text-slate-500">Monitor and manage all bookings across the platform.</p>
        </div>
      </div>
      <div className="card overflow-auto">
        {isLoading && <p>Loading bookings…</p>}
        {isError && <p className="text-red-600">Failed to load bookings.</p>}
        {data && (
          <table className="table min-w-[800px]">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Provider</th>
                <th>Booking Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr key={b.id} className="odd:bg-white even:bg-slate-50/40">
                  <td>{b.id}</td>
                  <td>{b.user?.name ?? `#${b.userId}`}</td>
                  <td>{b.service?.name ?? `#${b.serviceId}`}</td>
                  <td>{b.provider?.name ?? 'Unassigned'}</td>
                  <td>{new Date(b.bookingDate).toLocaleString()}</td>
                  <td>
                    <select
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      value={b.status}
                      onChange={(e) =>
                        mutateAsync({ id: b.id, status: e.target.value as BookingStatus }).catch(() => {})
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayoutShell>
  );
}

