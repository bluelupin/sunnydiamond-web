"use client";

import { useEffect, useRef } from "react";
import { validateIndianPincode } from "@/shared/utils/formValidation";
import { fetchPincodeCityState, PIN_LOOKUP_DEBOUNCE_MS } from "@/shared/utils/pincodeGeo.client";

type PincodeCityState = {
  city: string;
  state: string;
};

type UsePincodeCityStateAutofillOptions = {
  pincode: string;
  enabled?: boolean;
  onApply: (address: PincodeCityState, pin: string) => void;
};

/**
 * Debounced city/state fill from `/api/pincode-geo/:pin` when pincode is a valid 6-digit PIN.
 * Lookup failures are silent; fields stay editable (checkout parity).
 */
export function usePincodeCityStateAutofill({
  pincode,
  enabled = true,
  onApply,
}: UsePincodeCityStateAutofillOptions): void {
  const requestRef = useRef(0);
  const onApplyRef = useRef(onApply);
  onApplyRef.current = onApply;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const pin = pincode.trim();
    if (!validateIndianPincode(pin).valid) {
      return;
    }

    const requestId = ++requestRef.current;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        const address = await fetchPincodeCityState(pin);
        if (cancelled || requestId !== requestRef.current || !address) {
          return;
        }

        onApplyRef.current(address, pin);
      })();
    }, PIN_LOOKUP_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [enabled, pincode]);
}
