"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { apiClient } from "@services/apiClient";
import type { CategoryDto, ServiceDto } from "../../types/api";
import { Header } from "@components/Header";

async function fetchServices(categoryId?: number): Promise<ServiceDto[]> {
  const url = categoryId ? `/services?categoryId=${categoryId}` : "/services";
  const { data } = await apiClient.get<ServiceDto[]>(url);
  return data;
}

async function fetchCategories(): Promise<CategoryDto[]> {
  const { data } = await apiClient.get<CategoryDto[]>("/categories");
  return data;
}

export default function ServicesPage() {
  const [categoryId, setCategoryId] = useState<number | "">("");
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services", categoryId || undefined],
    queryFn: () => fetchServices(categoryId || undefined),
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {isLoading && <p className="text-slate-500">Loading services…</p>}
        {isError && <p className="text-red-600">Failed to load services.</p>}
        {services && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <Link key={svc.id} href={`/services/${svc.id}`}>
                <div className="card p-5 transition hover:shadow-md">
                  <h2 className="font-semibold text-slate-900">{svc.name}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {svc.description}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-brand-600">
                    ${Number(svc.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {services?.length === 0 && !isLoading && (
          <p className="text-slate-500">No services found.</p>
        )}
      </main>
    </>
  );
}
