"use client";

import { useMemo } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCustomerAddresses } from "@/features/account/hooks/useCustomerAddresses";
import { buildCheckoutContactPrefill } from "../utils/checkoutCustomer.utils";

export function useCheckoutCustomerPrefill() {
  const { status, customer } = useAuth();
  const isAuthenticated = status === "authenticated" && Boolean(customer);
  const { addresses, isLoading: addressesLoading, refresh: refreshAddresses } =
    useCustomerAddresses(isAuthenticated);

  const defaultFormPatch = useMemo(() => {
    if (!customer) {
      return null;
    }

    return buildCheckoutContactPrefill(customer);
  }, [customer]);

  const defaultShippingAddress = useMemo(() => {
    if (addresses.length === 0) {
      return null;
    }

    return addresses.find((address) => address.isDefaultShipping) ?? addresses[0];
  }, [addresses]);

  return {
    isAuthenticated,
    addressesLoading: isAuthenticated && addressesLoading,
    isLoading: status === "loading" || (isAuthenticated && addressesLoading),
    customer,
    addresses,
    defaultFormPatch,
    defaultShippingAddress,
    refreshAddresses,
  };
}
