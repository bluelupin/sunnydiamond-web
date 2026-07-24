"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { WISHLIST_STORAGE_KEY } from "@/features/wishlist/constants";

export type AuthCustomer = {
  firstname: string;
  lastname: string;
  email: string;
};

type AuthStatus = "loading" | "guest" | "authenticated";

interface AuthContextType {
  status: AuthStatus;
  customer: AuthCustomer | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [customer, setCustomer] = useState<AuthCustomer | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await response.json()) as { customer: AuthCustomer | null };
      setCustomer(data.customer);
      setStatus(data.customer ? "authenticated" : "guest");
    } catch {
      setCustomer(null);
      setStatus("guest");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setCustomer(null);
      setStatus("guest");
      // Full reload so cart/wishlist providers reset to a clean guest state.
      window.localStorage.removeItem("sunny-guest-cart-id");
      window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
      window.location.assign("/");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ status, customer, refresh, logout }),
    [status, customer, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
