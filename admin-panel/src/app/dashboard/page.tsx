"use client";

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';
import type { DashboardStats } from '@types/api';
import { AdminLayoutShell } from '@components/layout/AdminLayout';

async function fetchDashboard(): Promise<DashboardStats> {
  const res = await apiClient.get('/admin/dashboard');
  return res.data as DashboardStats;
}

export default function DashboardPage(): JSX.Element {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard
  });

  return (
    <AdminLayoutShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
          <p className="text-sm text-slate-500">
            Key metrics for your on-demand services marketplace.
          </p>
        </div>
      </div>
      {isLoading && <p>Loading dashboard…</p>}
      {isError && <p className="text-red-600">Failed to load dashboard.</p>}
      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active Users</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{data.totalUsers}</p>
          </div>
          <div className="card">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Service Providers</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{data.totalProviders}</p>
          </div>
          <div className="card">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Services</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{data.totalServices}</p>
          </div>
          <div className="card">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Bookings</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{data.totalBookings}</p>
          </div>
          <div className="card">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Pending</p>
            <p className="mt-2 text-2xl font-semibold text-amber-600">{data.pendingBookings}</p>
          </div>
          <div className="card">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">{data.completedBookings}</p>
          </div>
        </div>
      )}
    </AdminLayoutShell>
  );
}

