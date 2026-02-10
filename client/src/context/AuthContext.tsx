import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api, type AuthUser } from '../api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, displayName: string) => Promise<void>;
  sampleLogin: (username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('listwise_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.getMe()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('listwise_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { token, user } = await api.login(username, password);
    localStorage.setItem('listwise_token', token);
    setUser(user);
  }, []);

  const signup = useCallback(async (username: string, password: string, displayName: string) => {
    const { token, user } = await api.signup(username, password, displayName);
    localStorage.setItem('listwise_token', token);
    setUser(user);
  }, []);

  const sampleLogin = useCallback(async (username: string) => {
    const { token, user } = await api.sampleLogin(username);
    localStorage.setItem('listwise_token', token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('listwise_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, sampleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
