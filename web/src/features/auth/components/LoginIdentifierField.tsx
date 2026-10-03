"use client";

import type { RefObject } from "react";
import { DEFAULT_COUNTRY_CODE } from "@/shared/constants/appointmentForm";
import FormFieldError from "@/shared/ui/FormFieldError";
import PhoneCountryCodeSelect from "@/shared/ui/PhoneCountryCodeSelect";
import { cn } from "@/shared/utils/cn";
import { sanitizePhoneInput } from "@/shared/utils/formValidation";
import { isEmailIdentifier } from "../utils/authValidation";

type LoginIdentifierFieldProps = {
  identifier: string;
  countryCode: string;
  error?: string;
  emailOnly?: boolean;
  /** Dial codes that can get an SMS code — the picker offers only these. */
  countryCodes: readonly string[];
  inputRef?: RefObject<HTMLInputElement | null>;
  onIdentifierChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
};

const LoginIdentifierField = ({
  identifier,
  countryCode,
  error,
  emailOnly = false,
  countryCodes,
  inputRef,
  onIdentifierChange,
  onCountryCodeChange,
}: LoginIdentifierFieldProps) => {
  const isEmailMode = emailOnly || isEmailIdentifier(identifier);
  const showCountryCode = !emailOnly && !isEmailMode;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="login-identifier" className="font-gill text-base font-normal leading-110 text-darkblack">
        {emailOnly ? "Email Address" : "Phone Number or Email Address"}
        <span aria-hidden="true">*</span>
      </label>

      <div
        className={cn(
          "flex h-14 w-full items-center gap-2 border border-transparent bg-aboutInactive px-3 focus-within:border-darkblack",
          error && "border-[#F91616] bg-[#FEDCDC]",
        )}
      >
        {showCountryCode ? (
          <PhoneCountryCodeSelect
            id="login-country-code"
            value={countryCode || DEFAULT_COUNTRY_CODE}
            codes={countryCodes}
            onChange={(nextCode) => {
              onCountryCodeChange(nextCode);
              onIdentifierChange(sanitizePhoneInput(identifier, nextCode));
            }}
          />
        ) : null}
        <input
          ref={inputRef}
          id="login-identifier"
          type={emailOnly ? "email" : "text"}
          inputMode={emailOnly || isEmailMode ? "email" : "text"}
          value={identifier}
          onChange={(event) => onIdentifierChange(event.target.value)}
          placeholder={
            emailOnly ? "Enter your email address." : "Enter your phone number or email address."
          }
          autoComplete={isEmailMode ? "username" : "tel-national"}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-identifier-error" : undefined}
          className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600"
        />
      </div>

      <FormFieldError id="login-identifier-error" message={error} />
    </div>
  );
};

export default LoginIdentifierField;
