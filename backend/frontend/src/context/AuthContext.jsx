import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── On app load — try silent refresh ─────────
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to refresh using httpOnly cookie
        await authService.refresh();
        // If refresh worked — get user info
        const userData = await authService.me();
        setUser(userData);
      } catch (error) {
        // No valid session — user not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ── Login ─────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    const userData = await authService.me();
    setUser(userData);
    return data;
  }, []);

  // ── Logout ────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      window._accessToken = null;
    }
  }, []);

  // ── Register ──────────────────────────────────
  const register = useCallback(async (data) => {
    return await authService.register(data);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isLoggedIn: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}