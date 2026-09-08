"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";

type ShowAppStatusToastOptions = {
  action?: ReactNode;
  durationMs?: number;
};

type AppStatusToastContextValue = {
  showToast: (message: string, options?: ShowAppStatusToastOptions) => void;
  dismissToast: () => void;
};

const AppStatusToastContext = createContext<AppStatusToastContextValue | null>(null);

type AppStatusToastBridge = AppStatusToastContextValue;

let appStatusToastBridge: AppStatusToastBridge | null = null;

export function showGlobalAppStatusToast(
  message: string,
  options?: ShowAppStatusToastOptions,
) {
  appStatusToastBridge?.showToast(message, options);
}

export function dismissGlobalAppStatusToast() {
  appStatusToastBridge?.dismissToast();
}

export function AppStatusToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [action, setAction] = useState<ReactNode>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setMessage(null);
    setAction(undefined);
  }, []);

  const showToast = useCallback(
    (nextMessage: string, options?: ShowAppStatusToastOptions) => {
      const trimmed = nextMessage.trim();
      if (!trimmed) {
        return;
      }

      dismissToast();
      setMessage(trimmed);
      setAction(options?.action);

      timeoutRef.current = setTimeout(() => {
        setMessage(null);
        setAction(undefined);
        timeoutRef.current = null;
      }, options?.durationMs ?? appStatusToastDurationMs);
    },
    [dismissToast],
  );

  useEffect(() => {
    const bridge = { showToast, dismissToast };
    appStatusToastBridge = bridge;

    return () => {
      if (appStatusToastBridge === bridge) {
        appStatusToastBridge = null;
      }
    };
  }, [dismissToast, showToast]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return (
    <AppStatusToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <AppStatusToast open={Boolean(message)} message={message ?? ""} action={action} />
    </AppStatusToastContext.Provider>
  );
}

export function useAppStatusToast() {
  const context = useContext(AppStatusToastContext);

  if (!context) {
    throw new Error("useAppStatusToast must be used within AppStatusToastProvider");
  }

  return context;
}
