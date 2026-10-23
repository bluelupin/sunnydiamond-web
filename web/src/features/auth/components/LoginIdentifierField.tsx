"use client";

import { useEffect, useState, type RefObject } from "react";
import { DEFAULT_COUNTRY_CODE } from "@/shared/constants/appointmentForm";
import FormFieldError from "@/shared/ui/FormFieldError";
import PhoneCountryCodeSelect from "@/shared/ui/PhoneCountryCodeSelect";
import { cn } from "@/shared/utils/cn";
import {
  isEmailIdentifier,
  limitLoginIdentifier,
  shouldShowLoginCountryCode,
  validateLoginIdentifier,
} from "../utils/authValidation";

type LoginIdentifierFieldProps = {
  identifier: string;
  countryCode: string;
  error?: string;
  emailOnly?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  onIdentifierChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
};

const LoginIdentifierField = ({
  identifier,
  countryCode,
  error,
  emailOnly = false,
  inputRef,
  onIdentifierChange,
  onCountryCodeChange,
}: LoginIdentifierFieldProps) => {
  const [validation, setValidation] = useState<{
    identifier: string; countryCode: string; emailOnly: boolean; error?: string;
  }>();

  useEffect(() => {
    if (!identifier.trim()) return;
    const timer = window.setTimeout(() => {
      setValidation({
        identifier, countryCode, emailOnly,
        error: validateLoginIdentifier(identifier, countryCode, { emailOnly }).error,
      });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [identifier, countryCode, emailOnly]);

  // Ignore stale results immediately while a new value waits for the debounce.
  const fieldError = error ?? (
    identifier.trim() && validation?.identifier === identifier
      && validation.countryCode === countryCode && validation.emailOnly === emailOnly
      ? validation.error : undefined
  );
  const isEmailMode = emailOnly || isEmailIdentifier(identifier);
  const showCountryCode = shouldShowLoginCountryCode(identifier, { emailOnly });

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="login-identifier" className="font-gill text-base font-normal leading-110 text-darkblack">
        {emailOnly ? "Email Address" : "Phone Number or Email Address"}
        <span aria-hidden="true">*</span>
      </label>

      <div
        className={cn(
          "flex h-14 w-full items-center gap-2 border border-transparent bg-aboutInactive px-3 focus-within:border-darkblack",
          fieldError && "border-[#F91616] bg-[#FEDCDC]",
        )}
      >
        {showCountryCode ? (
          <PhoneCountryCodeSelect
            id="login-country-code"
            value={countryCode || DEFAULT_COUNTRY_CODE}
            onChange={(nextCode) => {
              onCountryCodeChange(nextCode);
              onIdentifierChange(limitLoginIdentifier(identifier, nextCode, emailOnly));
            }}
          />
        ) : null}
        <input
          ref={inputRef}
          id="login-identifier"
          type={emailOnly ? "email" : "text"}
          inputMode={emailOnly || isEmailMode ? "email" : "text"}
          value={identifier}
          onChange={(event) => onIdentifierChange(limitLoginIdentifier(event.target.value, countryCode, emailOnly))}
          placeholder={
            emailOnly ? "Enter Your Email Address." : "Enter your phone number or email address."
          }
          autoComplete={isEmailMode ? "username" : "tel-national"}
          required
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? "login-identifier-error" : undefined}
          className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600"
        />
      </div>

      <FormFieldError id="login-identifier-error" message={fieldError} />
    </div>
  );
};

export default LoginIdentifierField;
