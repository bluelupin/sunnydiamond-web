"use client";

import { useEffect, useRef } from "react";

const RETRY_TTL_MS = 30_000;

function getRetryStorageKey(pathname: string, digest?: string) {
  return `sd:auto-error-retry:${pathname}:${digest ?? "generic"}`;
}

/**
 * Silently retries once when a route error boundary mounts — mimics a refresh for
 * transient CMS/network/chunk failures without looping on persistent errors.
 */
export function useTransientErrorAutoRetry(reset: () => void, errorDigest?: string) {
  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    const key = getRetryStorageKey(window.location.pathname, errorDigest);
    const previous = sessionStorage.getItem(key);
    const now = Date.now();

    if (previous && now - Number(previous) < RETRY_TTL_MS) {
      return;
    }

    sessionStorage.setItem(key, String(now));

    const timer = window.setTimeout(() => {
      resetRef.current();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [errorDigest]);
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
