"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getCustomerAppointments } from "@/services/customer/customer-appointments.client";
import type { CustomerAppointmentsPage } from "@/services/customer/customer-appointments.types";

type UseCustomerAppointmentsResult = {
  data: CustomerAppointmentsPage | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  refresh: () => void;
};

export function useCustomerAppointments(
  enabled = true,
  pageSize = 20,
): UseCustomerAppointmentsResult {
  const { status, customer } = useAuth();
  const customerId = customer?.id;
  const phone = customer?.phone;
  const phoneVerified = customer?.phoneVerified;
  const email = customer?.email;
  const emailVerified = customer?.emailVerified;
  const canLoad = enabled && status === "authenticated" && customerId != null;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CustomerAppointmentsPage | null>(null);
  const [isLoading, setIsLoading] = useState(canLoad);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      // Schedule state updates after the effect; cleanup can cancel a superseded load.
      await Promise.resolve();
      if (cancelled) return;
      if (!canLoad) {
        setData(null);
        setIsLoading(false);
        setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const result = await getCustomerAppointments(page, pageSize, controller.signal);

        if (!cancelled) {
          if (!result) {
            setData(null);
            setError("Unable to load appointments. Please sign in again.");
          } else {
            setData(result);
          }
        }
      } catch (loadError) {
        if (!cancelled && !(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(
            loadError instanceof Error ? loadError.message : "Failed to load appointments",
          );
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
    // Scalar identity fields trigger a reload after verification without reloading
    // merely because auth refresh returned a new customer object.
  }, [canLoad, customerId, phone, phoneVerified, email, emailVerified, page, pageSize, refreshKey]);

  return { data, isLoading, error, page, setPage, refresh };
}
