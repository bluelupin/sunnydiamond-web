"use client";

import { useEffect, useRef, useState } from "react";
import {
  getCmsCacheEntry,
  isCmsCacheFresh,
  setCmsCacheEntry,
  type CmsCacheEntry,
} from "@/lib/homepage/cmsCache";
import type { AppDataCacheKey } from "@/lib/homepage/cmsCache";

type CmsSectionState<T> = {
  data?: T;
  isLoading: boolean;
  error?: string;
};

function readCachedState<T>(key: AppDataCacheKey): CmsSectionState<T> | null {
  const entry = getCmsCacheEntry<T>(key);
  if (entry?.value === undefined) return null;
  return { data: entry.value, isLoading: false, error: undefined };
}

export function useCmsSection<T>(
  queryKey: AppDataCacheKey,
  fetcher: (signal: AbortSignal) => Promise<T>,
  options?: { staleTimeMs?: number },
): CmsSectionState<T> {
  const staleTimeMs = options?.staleTimeMs ?? 60_000;
  const key = queryKey;

  const [state, setState] = useState<CmsSectionState<T>>(() => {
    const cached = readCachedState<T>(key);
    if (cached) return cached;
    return { data: undefined, isLoading: true, error: undefined };
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const existing = getCmsCacheEntry<T>(key);
    const staleValue = existing?.value;
    const isFresh = isCmsCacheFresh(key, staleTimeMs);

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

        setCmsCacheEntry<T>(key, {
          value: staleValue,
          promise,
          error: undefined,
          updatedAt: existing?.updatedAt ?? 0,
        });

        const data = await promise;

        setCmsCacheEntry<T>(key, {
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

        setCmsCacheEntry<T>(key, {
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
      const entry = getCmsCacheEntry<T>(key);
      if (entry?.promise) {
        setCmsCacheEntry<T>(key, {
          ...entry,
          promise: undefined,
        });
      }
    };
  }, [key, staleTimeMs, fetcher]);

  return state;
}

export type { CmsCacheEntry };
