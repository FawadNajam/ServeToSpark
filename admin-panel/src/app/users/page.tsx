"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@services/apiClient";
import type { UserDto } from "@types/api";
import { AdminLayoutShell } from "@components/layout/AdminLayout";

async function fetchUsers(): Promise<UserDto[]> {
  const res = await apiClient.get("/admin/users");
  return res.data as UserDto[];
}

export default function UsersPage(): JSX.Element {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
  });

  return (
    <AdminLayoutShell>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500">
            Manage customers and providers registered on the platform.
          </p>
        </div>
      </div>
      {isLoading && <p>Loading users…</p>}
      {isError && <p className="text-red-600">Failed to load users.</p>}
      {data && (
        <div className="card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id} className="odd:bg-white even:bg-slate-50/40">
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone ?? "-"}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayoutShell>
  );
}
