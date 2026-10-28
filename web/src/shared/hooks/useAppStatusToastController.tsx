"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";

type AppStatusToastControllerOptions = {
  hideIcon?: boolean;
  dismissible?: boolean;
};

/** Local AppStatusToast state for panels that must show feedback after closing. */
export function useAppStatusToastController(
  durationMs = appStatusToastDurationMs,
  options?: AppStatusToastControllerOptions,
) {
  const [message, setMessage] = useState<string | null>(null);
  const [action, setAction] = useState<ReactNode>(undefined);
  const hideIcon = options?.hideIcon ?? false;
  const dismissible = options?.dismissible ?? false;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setMessage(null);
    setAction(undefined);
  }, []);

  const show = useCallback(
    (nextMessage: string, options?: { action?: ReactNode }) => {
      const trimmed = nextMessage.trim();
      if (!trimmed) {
        return;
      }

      dismiss();
      setMessage(trimmed);
      setAction(options?.action);
      timeoutRef.current = setTimeout(() => {
        setMessage(null);
        setAction(undefined);
        timeoutRef.current = null;
      }, durationMs);
    },
    [dismiss, durationMs],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const node = (
    <AppStatusToast
      open={Boolean(message)}
      message={message ?? ""}
      action={action}
      hideIcon={hideIcon}
      onDismiss={dismissible ? dismiss : undefined}
    />
  );

  return { show, dismiss, node };
}
