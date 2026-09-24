"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type CheckoutContactOptions,
  type CheckoutFormField,
  type CheckoutFormValues,
  type CheckoutPaymentField,
  type CheckoutPaymentValues,
  getCheckoutFormErrors,
  getCheckoutPaymentErrors,
  isCheckoutFormValid,
  isCheckoutPaymentValid,
  shouldShowFieldError,
} from "@/shared/utils/formValidation";
import { INDIAN_STATES } from "@/features/checkout/constants/indianStates";

export const useCheckoutFormValidation = (
  values: CheckoutFormValues,
  /** Contact field mode; email-only when mobile sign-in is switched off. */
  contactOptions?: CheckoutContactOptions,
) => {
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<CheckoutFormField, boolean>>>({});
  // Destructured to scalars so the memos below are not invalidated by a fresh
  // options object on every render.
  const emailOnly = contactOptions?.emailOnly ?? false;
  const requireDeliveryPhone = contactOptions?.requireDeliveryPhone ?? false;

  const errors = useMemo(
    () => getCheckoutFormErrors(values, INDIAN_STATES, { emailOnly, requireDeliveryPhone }),
    [emailOnly, requireDeliveryPhone, values],
  );

  const isValid = useMemo(
    () => isCheckoutFormValid(values, INDIAN_STATES, { emailOnly, requireDeliveryPhone }),
    [emailOnly, requireDeliveryPhone, values],
  );

  const markTouched = useCallback((field: CheckoutFormField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  }, []);

  const showError = useCallback(
    (field: CheckoutFormField) =>
      shouldShowFieldError(Boolean(touched[field]), submitted, errors[field]),
    [errors, submitted, touched],
  );

  const validateSubmit = useCallback(
    (onValid: () => void) => {
      setSubmitted(true);

      if (isCheckoutFormValid(values, INDIAN_STATES, { emailOnly, requireDeliveryPhone })) {
        onValid();
      }
    },
    [emailOnly, requireDeliveryPhone, values],
  );

  const resetValidation = useCallback(() => {
    setSubmitted(false);
    setTouched({});
  }, []);

  const markSubmitted = useCallback(() => {
    setSubmitted(true);
  }, []);

  return {
    errors,
    isValid,
    submitted,
    markTouched,
    markSubmitted,
    showError,
    validateSubmit,
    resetValidation,
  };
};

export const useCheckoutPaymentValidation = (
  values: CheckoutPaymentValues,
  /** Whether Magento offers a cod-family method for this cart; the only COD gate. */
  codOffered: boolean,
  hasEngravedItems = false,
) => {
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<CheckoutPaymentField, boolean>>>({});

  const errors = useMemo(
    () => getCheckoutPaymentErrors(values, codOffered, hasEngravedItems),
    [codOffered, hasEngravedItems, values],
  );

  const isValid = useMemo(
    () => isCheckoutPaymentValid(values, codOffered, hasEngravedItems),
    [codOffered, hasEngravedItems, values],
  );

  const markTouched = useCallback((field: CheckoutPaymentField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  }, []);

  const showError = useCallback(
    (field: CheckoutPaymentField) =>
      shouldShowFieldError(Boolean(touched[field]), submitted, errors[field]),
    [errors, submitted, touched],
  );

  const validateSubmit = useCallback(
    (onValid: () => void) => {
      setSubmitted(true);

      if (isCheckoutPaymentValid(values, codOffered, hasEngravedItems)) {
        onValid();
      }
    },
    [codOffered, hasEngravedItems, values],
  );

  const resetValidation = useCallback(() => {
    setSubmitted(false);
    setTouched({});
  }, []);

  const markSubmitted = useCallback(() => {
    setSubmitted(true);
  }, []);

  return {
    errors,
    isValid,
    submitted,
    markTouched,
    markSubmitted,
    showError,
    validateSubmit,
    resetValidation,
  };
};
