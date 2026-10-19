"use client";

import type { RefObject } from "react";
import AppleIcon from "@/assets/Icons/AppleIcon";
import GoogleSignInButton from "./GoogleSignInButton";
import {
  CartDivider,
  CartPrimaryButton,
} from "@/features/cart/components/CartFlowUi";
import { getAuthFlowTitleClassName } from "../constants/authFlowTypography";
import LoginIdentifierField from "./LoginIdentifierField";

const socialButtonClassName =
  "inline-flex h-14 w-full items-center justify-center gap-2 border border-neutral300 px-7 font-gill text-sm uppercase leading-none text-darkblack btn-border-slide";

type LoginModalContentProps = {
  identifier: string;
  countryCode: string;
  identifierError?: string;
  emailOnly: boolean;
  otpBlockedForCountry: boolean;
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
    <span className="shrink-0 font-gill text-sm font-normal leading-110 text-gray600">
      or continue with
    </span>
    <CartDivider className="flex-1" />
  </div>
);

const SIGN_IN_DESCRIPTION =
  "Access your account to continue your journey with Sunny Diamonds.";

const LoginModalContent = ({
  identifier,
  countryCode,
  identifierError,
  emailOnly,
  otpBlockedForCountry,
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
  // Allow invalid input through to handleContinue so it can display the validation error.
  const canContinue = !noSignInMethod && !otpBlockedForCountry && !submitting;
  const showSocial = showGoogle || showApple;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canContinue) onContinue();
  };

  return (
    <form className="flex w-full flex-col gap-10" onSubmit={handleSubmit} noValidate>
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full items-center justify-between gap-4">
            <h2 className={getAuthFlowTitleClassName(titleClassName)}>Sign In</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sign in"
              className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
            >
              <CloseIcon />
            </button>
          </div>
          <p className="w-full font-gill text-base font-light leading-110 text-neutral500">
            {SIGN_IN_DESCRIPTION}
          </p>
        </div>

        <CartDivider />

        <LoginIdentifierField
          identifier={identifier}
          countryCode={countryCode}
          error={identifierError}
          emailOnly={emailOnly}
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
          <div role="status" className="flex items-center justify-between gap-1">
            {/* Adapted from the Authentication & Registration Flow document's wording,
                now that SMS codes reach some countries (CR-B3). */}
            <div role="alert" className="flex items-center gap-2 text-[#F91616]">
              <svg width="24" height="24" viewBox="0 0 19.125 19.125" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0" aria-hidden="true">
                <path d="M8.8125 8.8125C9.01141 8.8125 9.20218 8.89152 9.34283 9.03217C9.48348 9.17282 9.5625 9.36359 9.5625 9.5625V13.3125C9.5625 13.5114 9.64152 13.7022 9.78217 13.8428C9.92282 13.9835 10.1136 14.0625 10.3125 14.0625" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round">
                </path>
                <path d="M9.1875 6.375C9.70527 6.375 10.125 5.95527 10.125 5.4375C10.125 4.91973 9.70527 4.5 9.1875 4.5C8.66973 4.5 8.25 4.91973 8.25 5.4375C8.25 5.95527 8.66973 6.375 9.1875 6.375Z" fill="currentColor">
                </path>
                <path d="M9.5625 18.5625C14.5331 18.5625 18.5625 14.5331 18.5625 9.5625C18.5625 4.59194 14.5331 0.5625 9.5625 0.5625C4.59194 0.5625 0.5625 4.59194 0.5625 9.5625C0.5625 14.5331 4.59194 18.5625 9.5625 18.5625Z" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round">
                </path>
              </svg>
              <p className="min-w-0 font-gill text-sm font-light leading-none text-[#F91616]">SMS codes aren&apos;t available for this country yet.</p>
            </div>
            {/* <button
              type="button"
              onClick={onUseEmailInstead}
              className="self-start font-gill text-sm font-normal leading-110 text-darkblack underline-offset-2 hover:underline"
            >
              Use email instead
            </button> */}
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
