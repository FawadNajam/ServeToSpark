"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '@services/apiClient';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('admin_access_token');
    const storedUser = window.localStorage.getItem('admin_user');
    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { token: accessToken, user: loggedInUser } = res.data as { token: string; user: AuthUser };
    if (loggedInUser.role !== 'admin') {
      throw new Error('You must login with an admin account');
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('admin_access_token', accessToken);
      window.localStorage.setItem('admin_user', JSON.stringify(loggedInUser));
    }
    setToken(accessToken);
    setUser(loggedInUser);
  };

  const logout = (): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('admin_access_token');
      window.localStorage.removeItem('admin_user');
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

