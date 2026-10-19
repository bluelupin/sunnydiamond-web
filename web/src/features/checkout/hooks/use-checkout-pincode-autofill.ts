"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import { usePincodeCityStateAutofill } from "@/shared/hooks/use-pincode-city-state-autofill";

function applyPincodeAddress(
  setForm: Dispatch<SetStateAction<CheckoutFormData>>,
  pin: string,
  cityField: "city" | "billingCity",
  stateField: "state" | "billingState",
  pinField: "pincode" | "billingPincode",
  address: { city: string; state: string },
): void {
  setForm((current) => {
    if (current[pinField].trim() !== pin) {
      return current;
    }

    return {
      ...current,
      ...(address.city ? { [cityField]: address.city } : {}),
      ...(address.state ? { [stateField]: address.state } : {}),
    };
  });
}

/**
 * Fills city/state from the shared pincode API once a valid 6-digit PIN is entered.
 * Failures are silent so checkout stays manual when lookup is unavailable.
 */
export function useCheckoutPincodeAutofill(
  form: CheckoutFormData,
  setForm: Dispatch<SetStateAction<CheckoutFormData>>,
  enabled: boolean,
): void {
  const onApplyShipping = useCallback(
    (address: { city: string; state: string }, pin: string) => {
      applyPincodeAddress(setForm, pin, "city", "state", "pincode", address);
    },
    [setForm],
  );

  const onApplyBilling = useCallback(
    (address: { city: string; state: string }, pin: string) => {
      applyPincodeAddress(setForm, pin, "billingCity", "billingState", "billingPincode", address);
    },
    [setForm],
  );

  usePincodeCityStateAutofill({
    pincode: form.pincode,
    enabled,
    onApply: onApplyShipping,
  });

  usePincodeCityStateAutofill({
    pincode: form.billingPincode,
    enabled: enabled && !form.billingSameAsShipping,
    onApply: onApplyBilling,
  });
}
