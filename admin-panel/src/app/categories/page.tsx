"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { apiClient } from '@services/apiClient';
import type { CategoryDto } from '../../types/api';
import { AdminLayoutShell } from '@components/layout/AdminLayout';

async function fetchCategories(): Promise<CategoryDto[]> {
  const res = await apiClient.get('/categories');
  return res.data as CategoryDto[];
}

export default function CategoriesPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (newName: string) => {
      await apiClient.post('/categories', { name: newName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] }).catch(() => {});
      setName('');
    }
  });

  const handleCreate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!name.trim()) return;
    await mutateAsync(name.trim());
  };

  return (
    <AdminLayoutShell>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Service Categories</h2>
          <p className="text-sm text-slate-500">Organize your services into meaningful categories.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="card overflow-hidden">
          {isLoading && <p>Loading categories…</p>}
          {isError && <p className="text-red-600">Failed to load categories.</p>}
          {data && (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {data.map((cat) => (
                  <tr key={cat.id} className="odd:bg-white even:bg-slate-50/40">
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">Create Category</h3>
          <form className="space-y-3" onSubmit={handleCreate}>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="e.g. Home Cleaning"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <p className="text-xs text-red-600">Failed to create category.</p>}
            <button type="submit" disabled={isPending} className="btn-primary w-full">
              {isPending ? 'Creating…' : 'Add Category'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayoutShell>
  );
}

