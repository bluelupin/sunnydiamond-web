"use client";

import AppleIcon from "@/assets/Icons/AppleIcon";
import GoogleIcon from "@/assets/Icons/GoogleIcon";
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
  showGoogle: boolean;
  showApple: boolean;
  onIdentifierChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
  onContinue: () => void;
  onGoogleContinue: () => void;
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
  showGoogle,
  showApple,
  onIdentifierChange,
  onCountryCodeChange,
  onContinue,
  onGoogleContinue,
  onAppleContinue,
  onUseEmailInstead,
  onClose,
  titleClassName,
}: LoginModalContentProps) => {
  const canContinue =
    !otpBlockedForCountry && isLoginIdentifierReadyForOtp(identifier, countryCode, { emailOnly });
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
          onIdentifierChange={onIdentifierChange}
          onCountryCodeChange={onCountryCodeChange}
        />

        {otpBlockedForCountry ? (
          <div role="status" className="flex flex-col gap-1">
            {/* Wording fixed by the Authentication & Registration Flow document. */}
            <p className="font-gill text-sm font-light leading-110 text-neutral500">
              International mobile OTP is currently not supported. Please use your Email
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
      </div>

      <div className="flex w-full flex-col gap-4">
        <CartPrimaryButton
          type="submit"
          className="w-full uppercase disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canContinue}
        >
          CONTINUE
        </CartPrimaryButton>

        {showSocial ? <OrDivider /> : null}

        {showGoogle ? (
          <button type="button" className={socialButtonClassName} onClick={onGoogleContinue}>
            <GoogleIcon className="block size-6 shrink-0" />
            <span className="relative z-10 leading-none">CONTINUE WITH GOOGLE</span>
          </button>
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
