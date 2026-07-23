"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import LeftArrow from "@/assets/Icons/LeftArrow";
import { CartDivider, CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import FormFieldError from "@/shared/ui/FormFieldError";
import { cn } from "@/shared/utils/cn";
import { isCreateAccountReady } from "../utils/authValidation";

type LoginCreateAccountContentProps = {
  fullName: string;
  email: string;
  termsAccepted: boolean;
  fullNameError?: string;
  emailError?: string;
  termsError?: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onTermsAcceptedChange: (value: boolean) => void;
  onBack: () => void;
  onClose: () => void;
  onCreateAccount: () => void;
  titleClassName?: string;
};

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M18.5 5L5 18.5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 18.5L5 5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const fieldInputClassName =
  "h-14 w-full border border-transparent bg-aboutInactive px-3 font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600 focus:border-darkblack";

const LoginCreateAccountContent = ({
  fullName,
  email,
  termsAccepted,
  fullNameError,
  emailError,
  termsError,
  onFullNameChange,
  onEmailChange,
  onTermsAcceptedChange,
  onBack,
  onClose,
  onCreateAccount,
  titleClassName,
}: LoginCreateAccountContentProps) => {
  const canSubmit = isCreateAccountReady({ fullName, email, termsAccepted });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) onCreateAccount();
  };

  return (
    <form className="flex w-full flex-col gap-10" onSubmit={handleSubmit} noValidate>
      <div className="flex w-full flex-col gap-4">
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
                Enter Details
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

          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="create-account-full-name" className="font-gill text-base font-normal leading-110 text-darkblack">
                Full Name*
              </label>
              <input
                id="create-account-full-name"
                type="text"
                value={fullName}
                onChange={(event) => onFullNameChange(event.target.value)}
                placeholder="Enter"
                autoComplete="name"
                required
                aria-invalid={fullNameError ? true : undefined}
                aria-describedby={fullNameError ? "create-account-full-name-error" : undefined}
                className={cn(
                  fieldInputClassName,
                  fullNameError && "border-[#F91616] bg-[#FEDCDC]",
                )}
              />
              <FormFieldError id="create-account-full-name-error" message={fullNameError} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="create-account-email" className="font-gill text-base font-normal leading-110 text-darkblack">
                Email ID*
              </label>
              <input
                id="create-account-email"
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="Enter"
                autoComplete="email"
                required
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? "create-account-email-error" : undefined}
                className={cn(
                  fieldInputClassName,
                  emailError && "border-[#F91616] bg-[#FEDCDC]",
                )}
              />
              <FormFieldError id="create-account-email-error" message={emailError} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer items-center gap-2">
            <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => onTermsAcceptedChange(event.target.checked)}
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                required
                aria-invalid={termsError ? true : undefined}
                aria-describedby={termsError ? "create-account-terms-error" : undefined}
              />
              <span
                className={cn(
                  "flex size-6 items-center justify-center border border-darkblack bg-white",
                  termsAccepted && "border-transparent bg-linkGold",
                  termsError && "border-[#F91616]",
                )}
                aria-hidden
              >
                <Check
                  className={cn(
                    "size-4 text-white transition-opacity",
                    termsAccepted ? "opacity-100" : "opacity-0",
                  )}
                  strokeWidth={2.5}
                />
              </span>
            </span>
            <span className="font-gill text-sm font-normal leading-110 text-darkblack">
              I accept the terms and conditions
            </span>
          </label>
          <FormFieldError id="create-account-terms-error" message={termsError} />
          <p className="font-gill text-sm font-light leading-110 text-neutral500">
            By checking this box, you agree to receive updates, offers, and service-related communication.
            Your data is protected as per our{" "}
            <Link href="/privacy-policy" className="font-normal text-neutral500 underline-offset-2 hover:underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>

      <CartPrimaryButton
        type="submit"
        className="w-full uppercase disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canSubmit}
      >
        CREATE ACCOUNT
      </CartPrimaryButton>
    </form>
  );
};

export default LoginCreateAccountContent;
