"use client";

import type { RefObject } from "react";
import { ChevronDown } from "lucide-react";
import { APPOINTMENT_COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/shared/constants/appointmentForm";
import FormFieldError from "@/shared/ui/FormFieldError";
import { cn } from "@/shared/utils/cn";
import { sanitizePhoneInput } from "@/shared/utils/formValidation";
import { isEmailIdentifier } from "../utils/authValidation";

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
  const isEmailMode = emailOnly || isEmailIdentifier(identifier);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="login-identifier" className="font-gill text-base font-normal leading-110 text-darkblack">
        {emailOnly ? "Email ID*" : "Phone Number / Email ID*"}
      </label>

      {isEmailMode ? (
        <input
          ref={inputRef}
          id="login-identifier"
          type="email"
          inputMode="email"
          value={identifier}
          onChange={(event) => onIdentifierChange(event.target.value)}
          placeholder="Enter email"
          autoComplete="username"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-identifier-error" : undefined}
          className={cn(
            "h-14 w-full border border-transparent bg-aboutInactive px-3 font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600 focus:border-darkblack",
            error && "border-[#F91616] bg-[#FEDCDC]",
          )}
        />
      ) : (
        <div
          className={cn(
            "flex h-14 w-full items-center gap-2 border border-transparent bg-aboutInactive px-3 focus-within:border-darkblack",
            error && "border-[#F91616] bg-[#FEDCDC]",
          )}
        >
          <div className="relative flex shrink-0 items-center">
            <select
              value={countryCode || DEFAULT_COUNTRY_CODE}
              onChange={(event) => {
                onCountryCodeChange(event.target.value);
                onIdentifierChange(sanitizePhoneInput(identifier, event.target.value));
              }}
              aria-label="Country code"
              className="appearance-none bg-transparent pr-5 font-gill text-base leading-110 text-darkblack outline-none"
            >
              {APPOINTMENT_COUNTRY_CODES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.code}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              aria-hidden
              className="pointer-events-none absolute right-0 text-darkblack"
            />
          </div>
          <input
            ref={inputRef}
            id="login-identifier"
            type="tel"
            inputMode="numeric"
            value={identifier}
            onChange={(event) => onIdentifierChange(event.target.value)}
            placeholder="Enter phone number"
            autoComplete="tel-national"
            required
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "login-identifier-error" : undefined}
            className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600"
          />
        </div>
      )}

      <FormFieldError id="login-identifier-error" message={error} />
    </div>
  );
};

export default LoginIdentifierField;
