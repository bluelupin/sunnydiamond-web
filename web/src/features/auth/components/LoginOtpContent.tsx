"use client";

import Link from "next/link";
import type { KeyboardEvent, MutableRefObject } from "react";
import FormFieldErrorIcon from "@/assets/Icons/FormFieldErrorIcon";
import LeftArrow from "@/assets/Icons/LeftArrow";
import { CartDivider } from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { invalidFieldContainerClassName } from "@/shared/utils/formValidation";
import { cn } from "@/shared/utils/cn";
import { buildPolicyCertificationsHref } from "@/features/cms/utils/policyCertificationsRoutes";
import { formatLoginPhoneDisplay, isOtpComplete, LOGIN_OTP_LENGTH } from "../utils/authValidation";

const OTP_LENGTH = LOGIN_OTP_LENGTH;

type LoginOtpContentProps = {
  phone: string;
  countryCode: string;
  otp: string[];
  otpError?: string;
  secondsLeft: number;
  inputRefs: MutableRefObject<Array<HTMLInputElement | null>>;
  onDigitChange: (index: number, value: string) => void;
  onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onClose: () => void;
  onEdit: () => void;
  onLogin: () => void;
  onResend: () => void;
  titleClassName?: string;
};

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M18.5 5L5 18.5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 18.5L5 5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const formatPhoneForOtp = (countryCode: string, phone: string) =>
  formatLoginPhoneDisplay(countryCode, phone);

const LoginOtpContent = ({
  phone,
  countryCode,
  otp,
  otpError,
  secondsLeft,
  inputRefs,
  onDigitChange,
  onKeyDown,
  onBack,
  onClose,
  onEdit,
  onLogin,
  onResend,
  titleClassName,
}: LoginOtpContentProps) => {
  const isComplete = isOtpComplete(otp);
  const hasError = Boolean(otpError);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isComplete && !hasError) onLogin();
  };

  return (
    <form className="flex w-full flex-col gap-10" onSubmit={handleSubmit} noValidate>
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
            >
              <LeftArrow className="size-6" />
            </button>
            <h2
              className={cn(
                "font-larken font-light leading-110 text-darkblack",
                titleClassName ?? "text-32",
              )}
            >
              Enter Code
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in"
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
          >
            <CloseIcon />
          </button>
        </div>

        <CartDivider />

        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-gill text-base font-normal leading-110 text-darkblack">
              Please enter the OTP sent to {formatPhoneForOtp(countryCode, phone)}
            </p>
            <DetailTextLink onClick={onEdit}>EDIT</DetailTextLink>
          </div>

          <div
            className="flex w-full gap-2"
            role="group"
            aria-label="One-time password"
            aria-invalid={hasError || undefined}
          >
            {otp.map((digit, index) => (
              <div
                key={index}
                className={cn(
                  "relative flex h-14 flex-1 items-center justify-center border p-3",
                  hasError
                    ? invalidFieldContainerClassName
                    : "border-darkblack bg-aboutInactive",
                )}
              >
                <input
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => onDigitChange(index, event.target.value)}
                  onKeyDown={(event) => onKeyDown(index, event)}
                  className="absolute inset-0 bg-transparent text-center font-gill text-base leading-110 text-darkblack outline-none"
                  aria-label={`OTP digit ${index + 1}`}
                />
                {!digit ? <span className="size-2 rounded-full bg-gray50" aria-hidden /> : null}
              </div>
            ))}
          </div>

          {hasError ? (
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <FormFieldErrorIcon className="size-6 shrink-0 text-[#F91616]" />
                <p className="font-gill text-base font-normal leading-110 text-[#F91616]">
                  {otpError}
                </p>
              </div>
              <DetailTextLink onClick={onResend}>RESEND CODE</DetailTextLink>
            </div>
          ) : (
            <p className="w-full text-right font-gill text-base font-light leading-110 text-darkblack">
              {secondsLeft > 0 ? (
                <>
                  Resend code in{" "}
                  <span className="font-normal">00:{secondsLeft.toString().padStart(2, "0")}</span>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onResend}
                  className="font-normal underline decoration-darkblack underline-offset-2"
                >
                  Resend code
                </button>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        {hasError ? (
          <button
            type="button"
            disabled
            className="inline-flex h-14 w-full items-center justify-center bg-neutral500 px-7 py-5 font-gill text-sm uppercase leading-110 text-white opacity-50"
          >
            LOG IN
          </button>
        ) : (
          <button
            type="submit"
            disabled={!isComplete}
            className={cn(
              "inline-flex h-14 w-full items-center justify-center px-7 py-5 font-gill text-sm uppercase leading-110 text-white",
              "btn-dark-slide border border-black",
              !isComplete && "cursor-not-allowed opacity-50",
            )}
          >
            <span className="relative z-10">LOG IN</span>
          </button>
        )}

        <p className="text-center font-gill text-sm font-light leading-110 tracking-[0.252px] text-neutral500">
          By continuing, you agree to our{" "}
          <Link href="/terms-and-conditions" className="font-normal text-neutral500">
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href={buildPolicyCertificationsHref("privacy-policy")} className="font-normal text-neutral500">
            Privacy Policy
          </Link>
        </p>
      </div>
    </form>
  );
};

export { LOGIN_OTP_LENGTH as OTP_LENGTH };
export default LoginOtpContent;
