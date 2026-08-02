"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type AppointmentContactField,
  type AppointmentContactValidationOptions,
  type AppointmentContactValues,
  getAppointmentContactErrors,
  isAppointmentContactValid,
  shouldShowFieldError,
} from "@/shared/utils/formValidation";

export const useAppointmentFormValidation = (
  values: AppointmentContactValues,
  options: AppointmentContactValidationOptions = {},
) => {
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<AppointmentContactField, boolean>>>({});

  const errors = useMemo(
    () => getAppointmentContactErrors(values, options),
    [values, options],
  );

  const isValid = useMemo(
    () => isAppointmentContactValid(values, options),
    [values, options],
  );

  const markTouched = useCallback((field: AppointmentContactField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  }, []);

  const showError = useCallback(
    (field: AppointmentContactField) =>
      shouldShowFieldError(Boolean(touched[field]), submitted, errors[field]),
    [errors, submitted, touched],
  );

  const validateSubmit = useCallback(
    (onValid: () => void) => {
      setSubmitted(true);

      if (isAppointmentContactValid(values, options)) {
        onValid();
      }
    },
    [options, values],
  );

  const resetValidation = useCallback(() => {
    setSubmitted(false);
    setTouched({});
  }, []);

  return {
    errors,
    isValid,
    submitted,
    markTouched,
    showError,
    validateSubmit,
    resetValidation,
  };
};
