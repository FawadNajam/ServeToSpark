"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiClient } from "@services/apiClient";
import type { CategoryDto, ServiceDto } from "../../types/api";
import { AdminLayoutShell } from "@components/layout/AdminLayout";

async function fetchServices(): Promise<ServiceDto[]> {
  const res = await apiClient.get("/services");
  return res.data as ServiceDto[];
}

async function fetchCategories(): Promise<CategoryDto[]> {
  const res = await apiClient.get("/categories");
  return res.data as CategoryDto[];
}

export default function ServicesPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async () => {
      await apiClient.post("/services", {
        name,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] }).catch(() => {});
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
    },
  });

  const handleCreate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !price || !categoryId) return;
    await mutateAsync();
  };

  return (
    <AdminLayoutShell>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Services</h2>
          <p className="text-sm text-slate-500">
            Manage the catalog of services available in the marketplace.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[2fr,1.1fr]">
        <div className="card overflow-hidden">
          {isLoading && <p>Loading services…</p>}
          {isError && <p className="text-red-600">Failed to load services.</p>}
          {services && (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc) => (
                  <tr key={svc.id} className="odd:bg-white even:bg-slate-50/40">
                    <td>{svc.id}</td>
                    <td>{svc.name}</td>
                    <td>
                      {categories?.find((c) => c.id === svc.categoryId)?.name ??
                        `#${svc.categoryId}`}
                    </td>
                    <td>${Number(svc.price).toFixed(2)}</td>
                    <td>{new Date(svc.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Create Service
          </h3>
          <form className="space-y-3" onSubmit={handleCreate}>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Service name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={3}
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-1/2 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <select
                className="w-1/2 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <p className="text-xs text-red-600">Failed to create service.</p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full"
            >
              {isPending ? "Creating…" : "Add Service"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayoutShell>
  );
}
