"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";

/** Local AppStatusToast state for panels that must show feedback after closing. */
export function useAppStatusToastController(durationMs = appStatusToastDurationMs) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setMessage(null);
  }, []);

  const show = useCallback(
    (nextMessage: string) => {
      const trimmed = nextMessage.trim();
      if (!trimmed) {
        return;
      }

      dismiss();
      setMessage(trimmed);
      timeoutRef.current = setTimeout(() => {
        setMessage(null);
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

  const node = <AppStatusToast open={Boolean(message)} message={message ?? ""} />;

  return { show, dismiss, node };
}
