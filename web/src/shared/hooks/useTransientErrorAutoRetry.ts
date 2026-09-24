"use client";

import { useEffect, useRef } from "react";

const RETRY_TTL_MS = 30_000;

export type TransientRecoveryOutcome = "retry-scheduled" | "skipped" | "exhausted";

function getRetryStorageKey(pathname: string, digest?: string) {
  return `sd:auto-error-retry:${pathname}:${digest ?? "generic"}`;
}

export function attemptTransientRouteRecovery({
  reset,
  errorDigest,
  onExhausted,
}: {
  reset: () => void;
  errorDigest?: string;
  onExhausted?: () => void;
}): TransientRecoveryOutcome {
  if (typeof window === "undefined") {
    return "skipped";
  }

  const key = getRetryStorageKey(window.location.pathname, errorDigest);
  const previous = sessionStorage.getItem(key);
  const now = Date.now();

  if (previous && now - Number(previous) < RETRY_TTL_MS) {
    onExhausted?.();
    return "exhausted";
  }

  sessionStorage.setItem(key, String(now));

  window.setTimeout(() => {
    reset();
  }, 50);

  return "retry-scheduled";
}

/**
 * Silently retries once when a route error boundary mounts — mimics a refresh for
 * transient CMS/network/chunk failures without looping on persistent errors.
 */
export function useTransientErrorAutoRetry(
  reset: () => void,
  errorDigest?: string,
  enabled = true,
) {
  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    attemptTransientRouteRecovery({
      reset: () => resetRef.current(),
      errorDigest,
    });
  }, [enabled, errorDigest]);
}

export function clearTransientErrorAutoRetry(pathname: string) {
  const prefix = `sd:auto-error-retry:${pathname}:`;

  for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
    const key = sessionStorage.key(index);
    if (key?.startsWith(prefix)) {
      sessionStorage.removeItem(key);
    }
  }
}
