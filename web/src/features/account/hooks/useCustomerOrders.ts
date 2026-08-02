"use client";

import { useCallback, useEffect, useState } from "react";
import { getCustomerOrders } from "@/services/customer/customer-account.client";
import type { CustomerOrdersPage } from "@/services/customer/customer-account.types";

type UseCustomerOrdersResult = {
  data: CustomerOrdersPage | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
};

export function useCustomerOrders(enabled = true, pageSize = 10): UseCustomerOrdersResult {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CustomerOrdersPage | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const hasMore = data != null && data.currentPage < data.totalPages;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore) {
      return;
    }

    setPage((current) => current + 1);
  }, [hasMore, isLoading, isLoadingMore]);

  const refresh = useCallback(() => {
    setPage(1);
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setIsLoading(false);
      setIsLoadingMore(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    const isInitialLoad = page === 1;

    void (async () => {
      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const result = await getCustomerOrders(page, pageSize, controller.signal);

        if (!cancelled) {
          if (!result) {
            setData(null);
            setError("Unable to load orders. Please sign in again.");
          } else {
            setData((current) => {
              if (page === 1 || !current) {
                return result;
              }

              const existingIds = new Set(current.orders.map((order) => order.id));
              const nextOrders = result.orders.filter((order) => !existingIds.has(order.id));

              return {
                ...result,
                orders: [...current.orders, ...nextOrders],
              };
            });
          }
        }
      } catch (loadError) {
        if (!cancelled && !(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load orders");
        }
      } finally {
        if (!cancelled) {
          if (isInitialLoad) {
            setIsLoading(false);
          } else {
            setIsLoadingMore(false);
          }
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [enabled, page, pageSize, refreshKey]);

  return { data, isLoading, isLoadingMore, error, hasMore, loadMore, refresh };
}
