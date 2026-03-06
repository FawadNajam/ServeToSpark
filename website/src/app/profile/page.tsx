"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@services/apiClient";
import type { UserProfile } from "../../types/api";
import { Header } from "@components/Header";
import { useAuth } from "@hooks/useAuth";

async function fetchProfile(id: number): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>(`/users/${id}`);
  return data;
}

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      await apiClient.put(`/users/${user!.id}`, { name, phone: phone || null });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  useEffect(() => {
    if (user === null) router.replace("/login?redirect=/profile");
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-slate-600">Manage your account.</p>
        {isLoading && <p className="mt-6 text-slate-500">Loading…</p>}
        {isError && (
          <p className="mt-6 text-red-600">Failed to load profile.</p>
        )}
        {profile && (
          <form
            className="card mt-6 space-y-4 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate();
            }}
          >
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <p className="mt-1 text-slate-900">{profile.email}</p>
              <p className="text-xs text-slate-500">Email cannot be changed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                type="tel"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {updateMutation.isError && (
              <p className="text-sm text-red-600">Update failed. Try again.</p>
            )}
            {updateMutation.isSuccess && (
              <p className="text-sm text-emerald-600">Profile updated.</p>
            )}
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary"
            >
              {updateMutation.isPending ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}
      </main>
    </>
  );
}
