"use client";

import { useEffect, useState } from "react";
import { getCustomerProfileContact } from "@/services/customer/customer-profile.service";
import type { CustomerProfileContact } from "@/services/customer/customer-profile.types";

type UseCustomerProfileContactResult = {
  contact: CustomerProfileContact | null;
  isLoading: boolean;
};

/**
 * Graceful My Profile contact loader for form prefills.
 * Returns null contact while backend/auth is unavailable — forms stay empty/editable.
 */
export function useCustomerProfileContact(
  enabled = true,
): UseCustomerProfileContactResult {
  const [contact, setContact] = useState<CustomerProfileContact | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));

  useEffect(() => {
    if (!enabled) {
      setContact(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      try {
        const profile = await getCustomerProfileContact(controller.signal);
        if (!cancelled) {
          setContact(profile);
        }
      } catch {
        if (!cancelled) {
          setContact(null);
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
  }, [enabled]);

  return { contact, isLoading };
}
