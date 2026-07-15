import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api';
import { userApi } from '../api/user.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await userApi.getProfile();
      setUser(data.data.user);
    } catch {
      // Token is invalid or expired — clear it and continue as guest
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      // Always resolve loading — never leave the app stuck
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Safety net — if loadUser somehow never resolves, unblock the app after 5s
    const timeout = setTimeout(() => setIsLoading(false), 5000);
    loadUser().finally(() => clearTimeout(timeout));
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
