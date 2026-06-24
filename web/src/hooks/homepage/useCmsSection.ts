"use client";

import { useEffect, useRef, useState } from "react";
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

  // Always start in a loading state so SSR and the client hydration pass match.
  // Module-level cache may hold data from a prior server request; reading it here
  // would render CMS text on the server while the client still shows fallbacks.
  const [state, setState] = useState<CmsSectionState<T>>(() => ({
    data: undefined,
    isLoading: true,
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
    const staleValue = existing?.value;
    const isFresh = existing ? Date.now() - existing.updatedAt < staleTimeMs : false;

    if (staleValue !== undefined && isFresh) {
      setState({ data: staleValue, isLoading: false, error: undefined });
      return () => controller.abort();
    }

    const run = async () => {
      try {
        setState((prev) => ({
          data: prev.data ?? staleValue,
          isLoading: prev.data === undefined && staleValue === undefined,
          error: undefined,
        }));

        const promise = fetcher(controller.signal);

        cache.set(key, {
          value: staleValue,
          promise,
          error: undefined,
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
          value: staleValue,
          promise: undefined,
          error: message,
          updatedAt: existing?.updatedAt ?? 0,
        });

        if (mountedRef.current) {
          setState({
            data: staleValue,
            isLoading: false,
            error: staleValue === undefined ? message : undefined,
          });
        }
      }
    };

    run();

    return () => {
      controller.abort();
      const entry = cache.get(key) as CacheEntry<T> | undefined;
      if (entry?.promise) {
        cache.set(key, {
          ...entry,
          promise: undefined,
        });
      }
    };
  }, [key, staleTimeMs, fetcher]);

  return state;
}
