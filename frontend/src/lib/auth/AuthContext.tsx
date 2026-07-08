import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/lib/api/types";
import * as authApi from "@/lib/api/auth";
import { setAuthToken, setOnUnauthorized } from "@/lib/api/client";

interface AuthState {
  user: User | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<User>;
  register: (payload: authApi.RegisterPayload) => Promise<User>;
  logout: () => void;
}

const AuthCtx = createContext<AuthState | null>(null);
const STORE = { token: "taskflow.token", user: "taskflow.user" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const clearTaskCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["tasks"] });
  }, [queryClient]);

  useEffect(() => {
    try {
      const t = localStorage.getItem(STORE.token);
      const u = localStorage.getItem(STORE.user);
      if (t && u) {
        setToken(t);
        setAuthToken(t);
        setUser(JSON.parse(u));
      }
    } catch {}
    setReady(true);
  }, []);

  const handleUnauthorized = useCallback(() => {
    clearTaskCache();
    setUser(null);
    setToken(null);
    setAuthToken(null);
  }, [clearTaskCache]);

  useEffect(() => {
    setOnUnauthorized(handleUnauthorized);
    return () => setOnUnauthorized(null);
  }, [handleUnauthorized]);

  const login = useCallback<AuthState["login"]>(async (email, password, remember) => {
    const res = await authApi.login({ email, password, remember });
    clearTaskCache();
    setUser(res.user); setToken(res.token);
    setAuthToken(res.token);
    localStorage.setItem(STORE.token, res.token);
    localStorage.setItem(STORE.user, JSON.stringify(res.user));
    return res.user;
  }, [clearTaskCache]);

  const register = useCallback<AuthState["register"]>(async (payload) => {
    const res = await authApi.register(payload);
    clearTaskCache();
    setUser(res.user); setToken(res.token);
    setAuthToken(res.token);
    localStorage.setItem(STORE.token, res.token);
    localStorage.setItem(STORE.user, JSON.stringify(res.user));
    return res.user;
  }, [clearTaskCache]);

  const logout = useCallback(() => {
    clearTaskCache();
    setUser(null); setToken(null);
    setAuthToken(null);
    localStorage.removeItem(STORE.token);
    localStorage.removeItem(STORE.user);
  }, [clearTaskCache]);

  const value = useMemo(() => ({ user, token, ready, login, register, logout }), [user, token, ready, login, register, logout]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
