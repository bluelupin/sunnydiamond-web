"use client";

import type { RefObject } from "react";
import AppleIcon from "@/assets/Icons/AppleIcon";
import GoogleSignInButton from "./GoogleSignInButton";
import {
  CartDivider,
  CartPrimaryButton,
} from "@/features/cart/components/CartFlowUi";
import { cn } from "@/shared/utils/cn";
import LoginIdentifierField from "./LoginIdentifierField";
import { isLoginIdentifierReadyForOtp } from "../utils/authValidation";

const socialButtonClassName =
  "inline-flex h-14 w-full items-center justify-center gap-2 border border-neutral300 px-7 font-gill text-sm uppercase leading-none text-darkblack btn-border-slide";

type LoginModalContentProps = {
  identifier: string;
  countryCode: string;
  identifierError?: string;
  emailOnly: boolean;
  otpBlockedForCountry: boolean;
  /** Dial codes that can get an SMS code. */
  otpCountryCodes: readonly string[];
  /** The SMS could not be sent and email codes work: offer them instead. */
  offerEmailFallback: boolean;
  noSignInMethod: boolean;
  showGoogle: boolean;
  showApple: boolean;
  submitting: boolean;
  identifierInputRef: RefObject<HTMLInputElement | null>;
  onIdentifierChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
  onContinue: () => void;
  /** Called with the ID token from Google's own button — see GoogleSignInButton. */
  onGoogleCredential: (credential: string) => void;
  onAppleContinue: () => void;
  onUseEmailInstead: () => void;
  onClose: () => void;
  titleClassName?: string;
};

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M18.5 5L5 18.5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 18.5L5 5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OrDivider = () => (
  <div className="flex w-full items-center gap-2">
    <CartDivider className="flex-1" />
    <span className="shrink-0 font-gill text-sm font-normal leading-110 text-gray600">or</span>
    <CartDivider className="flex-1" />
  </div>
);

const LoginModalContent = ({
  identifier,
  countryCode,
  identifierError,
  emailOnly,
  otpBlockedForCountry,
  otpCountryCodes,
  offerEmailFallback,
  noSignInMethod,
  showGoogle,
  showApple,
  submitting,
  identifierInputRef,
  onIdentifierChange,
  onCountryCodeChange,
  onContinue,
  onGoogleCredential,
  onAppleContinue,
  onUseEmailInstead,
  onClose,
  titleClassName,
}: LoginModalContentProps) => {
  const canContinue =
    !noSignInMethod
    && !otpBlockedForCountry
    && isLoginIdentifierReadyForOtp(identifier, countryCode, { emailOnly });
  const showSocial = showGoogle || showApple;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canContinue) onContinue();
  };

  return (
    <form className="flex w-full flex-col gap-10" onSubmit={handleSubmit} noValidate>
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2
            className={cn(
              "font-larken font-light leading-110 text-darkblack",
              titleClassName ?? "text-32",
            )}
          >
            Sign In
          </h2>
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

        <LoginIdentifierField
          identifier={identifier}
          countryCode={countryCode}
          error={identifierError}
          emailOnly={emailOnly}
          countryCodes={otpCountryCodes}
          inputRef={identifierInputRef}
          onIdentifierChange={onIdentifierChange}
          onCountryCodeChange={onCountryCodeChange}
        />

        {noSignInMethod ? (
          <div role="status">
            <p className="font-gill text-sm font-light leading-110 text-neutral500">
              Sign-in is temporarily unavailable. Please try again shortly, or contact us
              if you need help with your order.
            </p>
          </div>
        ) : null}

        {!noSignInMethod && otpBlockedForCountry ? (
          <div role="status" className="flex flex-col gap-1">
            {/* Adapted from the Authentication & Registration Flow document's wording,
                now that SMS codes reach some countries (CR-B3). */}
            <p className="font-gill text-sm font-light leading-110 text-neutral500">
              SMS codes aren&apos;t available for this country yet. Please use your Email
              Address, Google Sign-In, or Apple Sign-In to continue.
            </p>
            <button
              type="button"
              onClick={onUseEmailInstead}
              className="self-start font-gill text-sm font-normal leading-110 text-darkblack underline-offset-2 hover:underline"
            >
              Use email instead
            </button>
          </div>
        ) : null}

        {!noSignInMethod && !otpBlockedForCountry && offerEmailFallback ? (
          <button
            type="button"
            onClick={onUseEmailInstead}
            className="self-start font-gill text-sm font-normal leading-110 text-darkblack underline-offset-2 hover:underline"
          >
            Get the code by email instead
          </button>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-4">
        <CartPrimaryButton
          type="submit"
          className="w-full uppercase disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canContinue || submitting}
        >
          {submitting ? "SENDING..." : "CONTINUE"}
        </CartPrimaryButton>

        {showSocial ? <OrDivider /> : null}

        {showGoogle ? (
          <GoogleSignInButton
            className={socialButtonClassName}
            onCredential={onGoogleCredential}
          />
        ) : null}

        {showApple ? (
          <button type="button" className={socialButtonClassName} onClick={onAppleContinue}>
            <AppleIcon className="block size-6 shrink-0 text-darkblack" />
            <span className="relative z-10 leading-none">CONTINUE WITH APPLE</span>
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default LoginModalContent;
