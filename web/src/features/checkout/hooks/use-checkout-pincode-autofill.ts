"use client";

import { useEffect, useRef, type Dispatch, type MutableRefObject, type SetStateAction } from "react";
import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import { validateIndianPincode } from "@/shared/utils/formValidation";

const PIN_LOOKUP_DEBOUNCE_MS = 400;
const PIN_LOOKUP_TIMEOUT_MS = 10000;

type PincodeGeoResponse = {
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
};

async function fetchPincodeAddress(
  pin: string,
  signal: AbortSignal,
): Promise<{ city: string; state: string } | null> {
  try {
    const response = await fetch(`/api/pincode-geo/${encodeURIComponent(pin)}`, { signal });
    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as PincodeGeoResponse;
    const city = payload.city?.trim() ?? "";
    const state = payload.state?.trim() ?? "";
    if (!city && !state) {
      return null;
    }

    return { city, state };
  } catch {
    return null;
  }
}

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
  const shippingRequestRef = useRef(0);
  const billingRequestRef = useRef(0);

  const scheduleLookup = (
    pin: string,
    requestRef: MutableRefObject<number>,
    cityField: "city" | "billingCity",
    stateField: "state" | "billingState",
    pinField: "pincode" | "billingPincode",
  ) => {
    if (!validateIndianPincode(pin).valid) {
      return () => {};
    }

    const requestId = ++requestRef.current;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        const address = await fetchPincodeAddress(pin, AbortSignal.timeout(PIN_LOOKUP_TIMEOUT_MS));
        if (cancelled || requestId !== requestRef.current || !address) {
          return;
        }

        applyPincodeAddress(setForm, pin, cityField, stateField, pinField, address);
      })();
    }, PIN_LOOKUP_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  };

  useEffect(() => {
    if (!enabled) {
      return;
    }

    return scheduleLookup(form.pincode.trim(), shippingRequestRef, "city", "state", "pincode");
  }, [enabled, form.pincode, setForm]);

  useEffect(() => {
    if (!enabled || form.billingSameAsShipping) {
      return;
    }

    return scheduleLookup(
      form.billingPincode.trim(),
      billingRequestRef,
      "billingCity",
      "billingState",
      "billingPincode",
    );
  }, [enabled, form.billingPincode, form.billingSameAsShipping, setForm]);
}
