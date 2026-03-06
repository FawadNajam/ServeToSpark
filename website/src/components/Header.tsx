'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@hooks/useAuth';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/bookings', label: 'My Bookings' },
  { href: '/profile', label: 'Profile' }
];

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-semibold text-brand-600">
          ServeToSpark
        </Link>
        <nav className="flex items-center gap-6">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium ${
                pathname === href ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <span className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="btn-secondary text-sm py-1.5 px-3"
              >
                Log out
              </button>
            </span>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm py-1.5 px-3">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-sm py-1.5 px-3">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
