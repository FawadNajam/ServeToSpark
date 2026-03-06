"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@hooks/useAuth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/services", label: "Services" },
  { href: "/categories", label: "Categories" },
  { href: "/bookings", label: "Bookings" },
];

export function AdminLayoutShell({ children }: { children: ReactNode }): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-60 flex-col border-r border-slate-200 bg-white px-4 py-6">
        <div className="mb-8">
          <div className="text-xl font-semibold text-brand-600">
            Service Admin
          </div>
          <div className="mt-1 text-xs text-slate-500">Serve To Spark</div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 text-xs text-slate-500">
          <div className="mb-2">Signed in as</div>
          <div className="font-medium text-slate-700">{user.name}</div>
          <div className="text-slate-400">{user.email}</div>
          <button
            type="button"
            onClick={logout}
            className="mt-4 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <h1 className="text-lg font-semibold text-slate-900">
            Admin Dashboard
          </h1>
        </header>
        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
