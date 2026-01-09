import { getLoginUrl } from "@/const";
import { useState, useEffect, useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

type User = {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  name?: string;
  role?: string;
  avatar?: string;
  phone?: string;
  headline?: string;
  bio?: string;
  location?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        // Normalize the user object to have a 'name' field
        if (!parsedUser.name && (parsedUser.first_name || parsedUser.full_name)) {
          parsedUser.name = parsedUser.full_name || `${parsedUser.first_name || ''} ${parsedUser.last_name || ''}`.trim();
        }
        setUser(parsedUser);
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle redirect for unauthenticated users
  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;
    if (window.location.pathname === "/login") return;
    if (window.location.pathname === "/register") return;

    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, loading, user]);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Try to call Django logout endpoint
        try {
          await fetch('https://8000-igaq82edlqb5u4iaikqp1-f81208bb.us2.manus.computer/api/auth/logout/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (e) {
          // Ignore logout API errors
        }
      }
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const refresh = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.name && (parsedUser.first_name || parsedUser.full_name)) {
          parsedUser.name = parsedUser.full_name || `${parsedUser.first_name || ''} ${parsedUser.last_name || ''}`.trim();
        }
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to refresh user', e);
      }
    } else {
      setUser(null);
    }
  }, []);

  const state = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
  }), [user, loading, error]);

  return {
    ...state,
    refresh,
    logout,
  };
}
