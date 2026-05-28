"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HomepageQueryKey } from "./queryKeys";

type CmsSectionState<T> = {
  data?: T;
  isLoading: boolean;
  error?: string;
};

type CacheEntry<T> = {
  value?: T;
  promise?: Promise<T>;
  error?: string;
  updatedAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export function useCmsSection<T>(
  queryKey: HomepageQueryKey,
  fetcher: (signal: AbortSignal) => Promise<T>,
  options?: { staleTimeMs?: number }
): CmsSectionState<T> {
  const staleTimeMs = options?.staleTimeMs ?? 60_000;
  const key = queryKey;

  const initial = useMemo(() => {
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;
    const isFresh = Date.now() - entry.updatedAt < staleTimeMs;
    if (isFresh && entry.value !== undefined) return entry.value;
    return undefined;
  }, [key, staleTimeMs]);

  const [state, setState] = useState<CmsSectionState<T>>(() => ({
    data: initial,
    isLoading: initial === undefined,
    error: undefined,
  }));

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const existing = cache.get(key) as CacheEntry<T> | undefined;
    const isFresh = existing ? Date.now() - existing.updatedAt < staleTimeMs : false;

    if (existing?.value !== undefined && isFresh) {
      setState({ data: existing.value, isLoading: false, error: existing.error });
      return () => controller.abort();
    }

    const run = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: prev.data === undefined, error: undefined }));

        const sharedPromise = existing?.promise;
        const promise =
          sharedPromise ??
          fetcher(controller.signal);

        cache.set(key, {
          value: existing?.value,
          promise,
          error: existing?.error,
          updatedAt: existing?.updatedAt ?? 0,
        });

        const data = await promise;

        cache.set(key, {
          value: data,
          promise: undefined,
          error: undefined,
          updatedAt: Date.now(),
        });

        if (mountedRef.current && !controller.signal.aborted) {
          setState({ data, isLoading: false, error: undefined });
        }
      } catch (e) {
        if (controller.signal.aborted) return;
        const message = e instanceof Error ? e.message : "Failed to load section";

        cache.set(key, {
          value: undefined,
          promise: undefined,
          error: message,
          updatedAt: Date.now(),
        });

        if (mountedRef.current) {
          setState({ data: undefined, isLoading: false, error: message });
        }
      }
    };

    run();

    return () => controller.abort();
  }, [key, staleTimeMs, fetcher]);

  return state;
}

