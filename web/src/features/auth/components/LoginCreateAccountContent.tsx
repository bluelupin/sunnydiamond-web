"use client";

import Link from "next/link";
import LeftArrow from "@/assets/Icons/LeftArrow";
import { CartDivider, CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import FormFieldError from "@/shared/ui/FormFieldError";
import GiftingPanelCheckbox from "@/shared/ui/GiftingPanelCheckbox";
import { cn } from "@/shared/utils/cn";
import { getAuthFlowTitleClassName } from "../constants/authFlowTypography";
import { DEFAULT_COUNTRY_CODE } from "@/shared/constants/appointmentForm";
import PhoneCountryCodeSelect from "@/shared/ui/PhoneCountryCodeSelect";
import { sanitizePhoneInput } from "@/shared/utils/formValidation";
import { buildPolicyCertificationsHref } from "@/features/cms/utils/policyCertificationsRoutes";
import { isCreateAccountReady, type CreateAccountSecondaryField } from "../utils/authValidation";

type LoginCreateAccountContentProps = {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  otpCountryCodes: readonly string[];
  missingIdentifier: CreateAccountSecondaryField;
  termsAccepted: boolean;
  marketingOptIn: boolean;
  fullNameError?: string;
  emailError?: string;
  phoneError?: string;
  termsError?: string;
  formError?: string;
  submitting: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
  onTermsAcceptedChange: (value: boolean) => void;
  onMarketingOptInChange: (value: boolean) => void;
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

const CREATE_ACCOUNT_DESCRIPTION =
  "Set up your account to enjoy a more personalised shopping experience.";

const LoginCreateAccountContent = ({
  fullName,
  email,
  phone,
  countryCode,
  otpCountryCodes,
  missingIdentifier,
  termsAccepted,
  marketingOptIn,
  fullNameError,
  emailError,
  phoneError,
  termsError,
  formError,
  submitting,
  onFullNameChange,
  onEmailChange,
  onPhoneChange,
  onCountryCodeChange,
  onTermsAcceptedChange,
  onMarketingOptInChange,
  onBack,
  onClose,
  onCreateAccount,
  titleClassName,
}: LoginCreateAccountContentProps) => {
  const canSubmit = isCreateAccountReady({
    fullName,
    termsAccepted,
    secondaryField: missingIdentifier,
    email,
    phone,
    countryCode,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) onCreateAccount();
  };

  return (
    <form className="flex w-full flex-col gap-10" onSubmit={handleSubmit} noValidate>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="Go back"
                  className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
                >
                  <LeftArrow className="size-6" />
                </button>
                <h2 className={getAuthFlowTitleClassName(titleClassName)}>Create Your Account</h2>
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
            <p className="w-full font-gill text-base font-light leading-110 text-neutral500">
              {CREATE_ACCOUNT_DESCRIPTION}
            </p>
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

            {missingIdentifier === "email" ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="create-account-email" className="font-gill text-base font-normal leading-110 text-darkblack">
                  Email ID*
                </label>
                <input
                  id="create-account-email"
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder="Enter your email address."
                  autoComplete="email"
                  required
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? "create-account-email-error" : undefined}
                  className={cn(fieldInputClassName, emailError && "border-[#F91616] bg-[#FEDCDC]")}
                />
                <FormFieldError id="create-account-email-error" message={emailError} />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label htmlFor="create-account-phone" className="font-gill text-base font-normal leading-110 text-darkblack">
                  Phone Number*
                </label>
                <div
                  className={cn(
                    "flex h-14 w-full items-center gap-2 border border-transparent bg-aboutInactive px-3 focus-within:border-darkblack",
                    phoneError && "border-[#F91616] bg-[#FEDCDC]",
                  )}
                >
                  <PhoneCountryCodeSelect
                    id="create-account-country-code"
                    value={countryCode || DEFAULT_COUNTRY_CODE}
                    codes={otpCountryCodes}
                    onChange={(nextCode) => {
                      onCountryCodeChange(nextCode);
                      onPhoneChange(sanitizePhoneInput(phone, nextCode));
                    }}
                  />
                  <input
                    id="create-account-phone"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(event) => onPhoneChange(event.target.value)}
                    placeholder="Enter your phone number."
                    autoComplete="tel-national"
                    required
                    aria-invalid={phoneError ? true : undefined}
                    aria-describedby={phoneError ? "create-account-phone-error" : undefined}
                    className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600"
                  />
                </div>
                <FormFieldError id="create-account-phone-error" message={phoneError} />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex w-full items-center gap-2">
            <GiftingPanelCheckbox
              id="create-account-terms"
              checked={termsAccepted}
              onChange={onTermsAcceptedChange}
              aria-label="Agree to Terms and Conditions and Privacy Policy"
              className="translate-y-0 shrink-0"
            />
            <p
              className="min-w-0 flex-1 font-gill text-sm leading-110"
              aria-invalid={termsError ? true : undefined}
              aria-describedby={termsError ? "create-account-terms-error" : undefined}
            >
              <span className="font-light text-neutral500">I agree to the</span>
              <Link
                href="/terms-and-conditions"
                className="font-normal text-darkblack underline-offset-2 hover:underline"
              >
                {" "}
                Terms &amp; Conditions
              </Link>
              <span className="font-light text-neutral500"> and</span>
              <Link
                href={buildPolicyCertificationsHref("privacy-policy")}
                className="font-normal text-darkblack underline-offset-2 hover:underline"
              >
                {" "}
                Privacy Policy
              </Link>
            </p>
          </div>
          <FormFieldError id="create-account-terms-error" message={termsError} />
          <div className="flex w-full items-center gap-2">
            <GiftingPanelCheckbox
              id="create-account-marketing"
              checked={marketingOptIn}
              onChange={onMarketingOptInChange}
              aria-label="Agree to receive updates and offers"
              className="translate-y-0 shrink-0"
            />
            <p className="min-w-0 flex-1 font-gill text-sm font-light leading-110 text-neutral500">
              I agree to receive updates, offers, and service-related communication.
            </p>
          </div>
        </div>
      </div>

      {formError ? (
        <FormFieldError id="create-account-form-error" message={formError} />
      ) : null}

      <CartPrimaryButton
        type="submit"
        className="w-full uppercase disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canSubmit || submitting}
      >
        {submitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
      </CartPrimaryButton>
    </form>
  );
};

export default LoginCreateAccountContent;
