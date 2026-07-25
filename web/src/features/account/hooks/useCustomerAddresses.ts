"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  getCustomerAddresses,
  removeCustomerAddress,
  saveCustomerAddress,
} from "@/services/customer/customer-account.client";
import type {
  CustomerAddress,
  CustomerAddressInput,
} from "@/services/customer/customer-account.types";

type UseCustomerAddressesResult = {
  addresses: CustomerAddress[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => void;
  createAddress: (input: CustomerAddressInput) => Promise<void>;
  updateAddress: (uid: string, input: CustomerAddressInput) => Promise<void>;
  deleteAddress: (uid: string) => Promise<void>;
};

export function useCustomerAddresses(enabled = true): UseCustomerAddressesResult {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  // Keep loading true synchronously when auth enables the hook so checkout
  // prefill does not run before the saved-address fetch starts.
  useLayoutEffect(() => {
    if (enabled) {
      setIsLoading(true);
      return;
    }

    setAddresses([]);
    setIsLoading(false);
    setError(null);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getCustomerAddresses(controller.signal);

        if (!cancelled) {
          if (!result) {
            setAddresses([]);
            setError("Unable to load addresses. Please sign in again.");
          } else {
            setAddresses(result);
          }
        }
      } catch (loadError) {
        if (!cancelled && !(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load addresses");
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
  }, [enabled, refreshKey]);

  const createAddress = useCallback(async (input: CustomerAddressInput) => {
    setIsSaving(true);
    setError(null);

    try {
      const nextAddresses = await saveCustomerAddress(input);
      setAddresses(nextAddresses);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Failed to save address";
      setError(message);
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateAddress = useCallback(async (uid: string, input: CustomerAddressInput) => {
    setIsSaving(true);
    setError(null);

    try {
      const nextAddresses = await saveCustomerAddress(input, uid);
      setAddresses(nextAddresses);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Failed to update address";
      setError(message);
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteAddress = useCallback(async (uid: string) => {
    setIsSaving(true);
    setError(null);

    try {
      const nextAddresses = await removeCustomerAddress(uid);
      setAddresses(nextAddresses);
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Failed to delete address";
      setError(message);
      throw deleteError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    addresses,
    isLoading,
    isSaving,
    error,
    refresh,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
