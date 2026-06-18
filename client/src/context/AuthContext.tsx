import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import api from '../services/api';
import type { AuthResponse, ProfileResponse, User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('slack-clone-token'));
  const [loading, setLoading] = useState<boolean>(Boolean(token));

  const persistSession = (sessionToken: string, sessionUser: User): void => {
    localStorage.setItem('slack-clone-token', sessionToken);
    setToken(sessionToken);
    setUser(sessionUser);
  };

  const clearSession = (): void => {
    localStorage.removeItem('slack-clone-token');
    setToken(null);
    setUser(null);
  };

  const login = async (email: string, password: string): Promise<void> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    persistSession(data.token, data.user);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
    persistSession(data.token, data.user);
  };

  const refreshProfile = async (): Promise<void> => {
    const { data } = await api.get<ProfileResponse>('/auth/profile');
    setUser(data.user);
  };

  const logout = (): void => {
    clearSession();
  };

  useEffect(() => {
    let cancelled = false;

    const hydrateAuth = async (): Promise<void> => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get<ProfileResponse>('/auth/profile');
        if (!cancelled) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void hydrateAuth();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
