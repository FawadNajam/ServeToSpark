'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiClient } from '@services/apiClient';
import type { ServiceDto } from '@types/api';
import { Header } from '@components/Header';

async function fetchService(id: number): Promise<ServiceDto> {
  const { data } = await apiClient.get<ServiceDto>(`/services/${id}`);
  return data;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: service, isLoading, isError } = useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchService(id),
    enabled: !Number.isNaN(id)
  });

  if (Number.isNaN(id)) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-red-600">Invalid service.</p>
          <Link href="/services" className="mt-2 inline-block text-brand-600 hover:underline">
            Back to services
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/services" className="text-sm text-brand-600 hover:underline">
          ← Back to services
        </Link>
        {isLoading && <p className="mt-4 text-slate-500">Loading…</p>}
        {isError && (
          <p className="mt-4 text-red-600">Failed to load service.</p>
        )}
        {service && (
          <div className="mt-6">
            <div className="card p-6">
              <h1 className="text-2xl font-bold text-slate-900">{service.name}</h1>
              <p className="mt-2 text-slate-600">{service.description}</p>
              <p className="mt-4 text-2xl font-semibold text-brand-600">
                ${Number(service.price).toFixed(2)}
              </p>
              <Link
                href={`/book?serviceId=${service.id}`}
                className="btn-primary mt-6 inline-block"
              >
                Book this service
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
