"use client";

import FormFieldErrorIcon from "@/assets/Icons/FormFieldErrorIcon";
import LeftArrow from "@/assets/Icons/LeftArrow";
import { CartDivider, CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { cn } from "@/shared/utils/cn";

type LoginPasswordContentProps = {
  email: string;
  password: string;
  passwordError?: string;
  onPasswordChange: (value: string) => void;
  onBack: () => void;
  onClose: () => void;
  onLogin: () => void;
  onCreateAccount: () => void;
  titleClassName?: string;
};

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M18.5 5L5 18.5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 18.5L5 5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LoginPasswordContent = ({
  email,
  password,
  passwordError,
  onPasswordChange,
  onBack,
  onClose,
  onLogin,
  onCreateAccount,
  titleClassName,
}: LoginPasswordContentProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin();
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
              Sign In
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
            <p className="min-w-0 break-all font-gill text-base font-normal leading-110 text-darkblack">
              Signing in as {email}
            </p>
            <DetailTextLink onClick={onBack}>EDIT</DetailTextLink>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className="font-gill text-base font-normal leading-110 text-darkblack">
              Password*
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Enter"
              autoComplete="current-password"
              required
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? "login-password-error" : undefined}
              className={cn(
                "h-14 w-full border border-transparent bg-aboutInactive px-3 font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600 focus:border-darkblack",
                passwordError && "border-[#F91616] bg-[#FEDCDC]",
              )}
            />
            {passwordError ? (
              <div id="login-password-error" role="alert" className="flex items-center gap-2">
                <FormFieldErrorIcon className="size-6 shrink-0 text-[#F91616]" />
                <p className="font-gill text-base font-normal leading-110 text-[#F91616]">
                  {passwordError}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <CartPrimaryButton
        type="submit"
        className="w-full uppercase disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!password}
      >
        LOG IN
      </CartPrimaryButton>

      <p className="text-center font-gill text-sm font-light leading-110 text-neutral500">
        New to Sunny Diamonds?{" "}
        <button
          type="button"
          onClick={onCreateAccount}
          className="font-normal text-darkblack underline-offset-2 hover:underline"
        >
          Create an account
        </button>
      </p>
    </form>
  );
};

export default LoginPasswordContent;
