"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCmsSection } from "@/hooks/homepage/useCmsSection";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { MAGENTO_CATALOG_REVALIDATE_SECONDS } from "@/services/magento/config";
import {
  markHomepageTrendingFetchStart,
  reportHomepageTrendingReady,
} from "@/lib/homepage/homepagePerformance";
import { magentoQueryKeys } from "./queryKeys";

export function useMagentoTrendingProducts() {
  const networkFetchRef = useRef({ didFetch: false, durationMs: 0 });
  const reportedRef = useRef(false);

  const fetcher = useCallback(async (signal: AbortSignal): Promise<JewelleryListingProduct[]> => {
    markHomepageTrendingFetchStart();
    networkFetchRef.current.didFetch = true;

    const startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();

    try {
      const response = await fetch("/api/magento/trending-products", {
        signal,
        cache: "default",
      });

      if (!response.ok) {
        throw new Error("Failed to load trending products");
      }

      const data = (await response.json()) as JewelleryListingProduct[];
      return Array.isArray(data) ? data : [];
    } finally {
      networkFetchRef.current.durationMs =
        (typeof performance !== "undefined" ? performance.now() : Date.now()) - startedAt;
    }
  }, []);

  const state = useCmsSection<JewelleryListingProduct[]>(magentoQueryKeys.trendingProducts, fetcher, {
    staleTimeMs: MAGENTO_CATALOG_REVALIDATE_SECONDS * 1000,
  });

  useEffect(() => {
    if (reportedRef.current || state.isLoading) {
      return;
    }

    reportedRef.current = true;
    reportHomepageTrendingReady({
      source: networkFetchRef.current.didFetch ? "network" : "cache",
      productCount: state.data?.length ?? 0,
      durationMs: networkFetchRef.current.durationMs,
    });
  }, [state.isLoading, state.data]);

  return state;
}
