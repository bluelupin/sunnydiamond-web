"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { clearGuestWishlistStorage } from "@/features/wishlist/utils/guestWishlistStorage";
import { sanitizeAuthCustomer } from "@/shared/utils/customerName";

export type AuthCustomer = {
  id: number;
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

/** Background attempts before an unreachable session endpoint resolves to guest. */
const SESSION_RETRY_LIMIT = 3;
const SESSION_RETRY_DELAY_MS = 3000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [customer, setCustomer] = useState<AuthCustomer | null>(null);
  // Mirrors `status` for the retry decision, which happens outside render.
  const statusRef = useRef<AuthStatus>("loading");
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);
  const refreshRef = useRef<() => Promise<void>>(async () => {});

  const applyStatus = useCallback((next: AuthStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const refresh = useCallback(async () => {
    const fetchMe = async () => {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await response.json()) as { customer: AuthCustomer | null };
      return { ok: response.ok, customer: data.customer };
    };

    try {
      // A non-ok answer is the endpoint failing (Magento 5xx, network), not an
      // answer about the session — retry once before deciding anything.
      let result = await fetchMe().catch(() => null);
      if (!result?.ok) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        result = await fetchMe();
      }
      if (!result.ok) {
        throw new Error("auth/me unavailable");
      }
      retryCountRef.current = 0;
      setCustomer(result.customer ? sanitizeAuthCustomer(result.customer) : null);
      applyStatus(result.customer ? "authenticated" : "guest");
    } catch {
      // The session endpoint is unreachable — we have NO answer about the
      // session, so never resolve to "guest" on a blip: that bounced valid
      // sessions (fresh registrations included) out of /profile (QA bug #18).
      // Keep "loading" and retry in the background; give up to "guest" only
      // after the endpoint stays down (~10s), so the UI cannot spin forever.
      if (statusRef.current !== "loading") {
        return;
      }

      if (retryCountRef.current < SESSION_RETRY_LIMIT) {
        retryCountRef.current += 1;
        // One timer at a time: a queued retry replaces nothing, it IS the retry.
        if (retryTimerRef.current == null) {
          retryTimerRef.current = window.setTimeout(() => {
            retryTimerRef.current = null;
            void refreshRef.current();
          }, SESSION_RETRY_DELAY_MS);
        }
        return;
      }

      applyStatus("guest");
    }
  }, [applyStatus]);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setCustomer(null);
      applyStatus("guest");
      // Full reload so cart/wishlist providers reset to a clean guest state.
      window.localStorage.removeItem("sunny-guest-cart-id");
      clearGuestWishlistStorage();
      window.location.assign("/");
    }
  }, [applyStatus]);

  // The session lives behind /api/auth/me — an external system this effect
  // subscribes to on mount. Every state write happens in the promise callback,
  // never synchronously in the effect body.
  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (!cancelled) {
        return refreshRef.current();
      }
      return undefined;
    });

    return () => {
      cancelled = true;
      if (retryTimerRef.current != null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

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
