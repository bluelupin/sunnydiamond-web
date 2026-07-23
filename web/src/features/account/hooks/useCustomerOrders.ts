"use client";

import { useCallback, useEffect, useState } from "react";
import { getCustomerOrders } from "@/services/customer/customer-account.client";
import type { CustomerOrdersPage } from "@/services/customer/customer-account.types";

type UseCustomerOrdersResult = {
  data: CustomerOrdersPage | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  refresh: () => void;
};

export function useCustomerOrders(enabled = true, pageSize = 10): UseCustomerOrdersResult {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CustomerOrdersPage | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getCustomerOrders(page, pageSize, controller.signal);

        if (!cancelled) {
          if (!result) {
            setData(null);
            setError("Unable to load orders. Please sign in again.");
          } else {
            setData(result);
          }
        }
      } catch (loadError) {
        if (!cancelled && !(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load orders");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [enabled, page, pageSize, refreshKey]);

  return { data, isLoading, error, page, setPage, refresh };
}
