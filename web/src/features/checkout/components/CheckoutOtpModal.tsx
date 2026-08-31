"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import {
  requestLoginOtp,
  verifyLoginOtp,
} from "@/features/auth/services/auth.service";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { useResponsiveOverlayShell } from "@/shared/hooks/use-responsive-overlay-shell";
import { DetailTextLink } from "@/features/products/components/detail/shared";

const CHECKOUT_OTP_MOBILE_QUERY = "(max-width: 1023px)";

const CHECKOUT_OTP_OVERLAY_CLASS = "z-[70] bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]";

export type CheckoutOtpVerifyResult = {
  otp: string;
  registrationRequired: boolean;
  loggedIn: boolean;
};

type CheckoutOtpModalProps = {
  open: boolean;
  phone: string;
  onClose: () => void;
  onVerify: (result: CheckoutOtpVerifyResult) => void;
};

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "+91 ******";
  return `+91 ${digits.slice(0, 2)}******${digits.slice(-2)}`;
};

type CheckoutOtpFieldsProps = {
  phone: string;
  otp: string[];
  secondsLeft: number;
  otpError?: string;
  inputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  onDigitChange: (index: number, value: string) => void;
  onKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void;
  onResend: () => void;
  variant?: "mobile" | "desktop";
};

const CheckoutOtpFields = ({
  phone,
  otp,
  secondsLeft,
  otpError,
  inputRefs,
  onDigitChange,
  onKeyDown,
  onResend,
  variant = "desktop",
}: CheckoutOtpFieldsProps) => (
  <div className="flex flex-col items-end gap-4">
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="font-gill text-base font-light leading-110 text-darkblack">
          Please enter the OTP sent to {maskPhone(phone)}
        </p>
        <DetailTextLink>EDIT</DetailTextLink>
      </div>
      <div className="flex w-full gap-1">
        {otp.map((digit, index) => (
          <div
            key={index}
            className={
              variant === "mobile"
                ? "relative flex h-[54px] flex-1 items-center justify-center bg-aboutInactive px-2 py-2"
                : "relative flex h-20 flex-1 items-center justify-center bg-aboutInactive px-[13px] py-3"
            }
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
              className={
                variant === "mobile"
                  ? "absolute inset-0 bg-transparent text-center font-gill text-base leading-110 text-darkblack outline-none"
                  : "absolute inset-0 bg-transparent text-center font-gill text-base leading-110 text-darkblack outline-none lg:text-xl"
              }
              aria-label={`OTP digit ${index + 1}`}
              aria-invalid={otpError ? true : undefined}
            />
            {!digit ? <span className="size-2 rounded-full bg-gray50" aria-hidden /> : null}
          </div>
        ))}
      </div>
      {otpError ? (
        <p className="w-full font-gill text-sm font-light leading-110 text-[#F91616]">{otpError}</p>
      ) : null}
    </div>
    {secondsLeft > 0 ? (
      <p className="font-gill text-base font-light leading-110 text-darkblack">
        {`Resend code in 00:${secondsLeft.toString().padStart(2, "0")}`}
      </p>
    ) : (
      <button
        type="button"
        onClick={onResend}
        className="font-gill text-base font-light leading-110 text-darkblack underline"
      >
        Resend code
      </button>
    )}
  </div>
);

const CheckoutOtpVerifyButton = ({
  disabled,
  onClick,
  loading,
}: {
  disabled: boolean;
  onClick: () => void;
  loading?: boolean;
}) => (
  <CartPrimaryButton
    type="button"
    className="w-full uppercase disabled:cursor-not-allowed disabled:opacity-50"
    disabled={disabled || loading}
    onClick={onClick}
  >
    {loading ? "VERIFYING..." : "VERIFY"}
  </CartPrimaryButton>
);

const CheckoutOtpDesktopPanel = ({
  onClose,
  otpFieldsProps,
  isComplete,
  isVerifying,
  onVerify,
}: {
  onClose: () => void;
  otpFieldsProps: CheckoutOtpFieldsProps;
  isComplete: boolean;
  isVerifying: boolean;
  onVerify: () => void;
}) => (
  <div className="flex w-full max-w-[560px] flex-col gap-6 bg-white p-6">
    <div className="flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Go back"
          className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M15.5 20L8 12.5L15.5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">Enter OTP</h2>
      </div>
      <button type="button" onClick={onClose} aria-label="Close" className="text-darkblack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M18.5 5L5 18.5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 18.5L5 5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>

    <CheckoutOtpFields {...otpFieldsProps} variant="desktop" />

    <hr className="border-neutral300" />
    <CheckoutOtpVerifyButton
      disabled={!isComplete}
      loading={isVerifying}
      onClick={onVerify}
    />
  </div>
);

const CheckoutOtpModal = ({ open, phone, onClose, onVerify }: CheckoutOtpModalProps) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [otpError, setOtpError] = useState<string | undefined>();
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { showMobileShell } = useResponsiveOverlayShell(open, CHECKOUT_OTP_MOBILE_QUERY);

  const phoneDigits = phone.replace(/\D/g, "");

  const sendOtp = useCallback(async () => {
    if (phoneDigits.length < 10) {
      setOtpError("Enter a valid phone number before requesting an OTP.");
      return;
    }

    // Checkout only ever verifies a mobile number, never an email address.
    const result = await requestLoginOtp({ kind: "phone", phone: phoneDigits });
    if (!result.success) {
      setOtpError(result.error);
      return;
    }

    setOtpError(undefined);
    setSecondsLeft(result.resendAfterSeconds);
  }, [phoneDigits]);

  useEffect(() => {
    if (!open) {
      setOtp(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(RESEND_SECONDS);
      setOtpError(undefined);
      setIsVerifying(false);
      return;
    }

    void sendOtp();

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [open, sendOtp]);

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every((digit) => digit.length === 1);

  const handleVerify = async () => {
    if (!isComplete || isVerifying) {
      return;
    }

    setIsVerifying(true);
    setOtpError(undefined);

    const result = await verifyLoginOtp({ kind: "phone", phone: phoneDigits }, otp.join(""));
    setIsVerifying(false);

    if (!result.success) {
      setOtpError(result.error);
      return;
    }

    onVerify({
      otp: otp.join(""),
      registrationRequired: result.requiresAccountSetup,
      loggedIn: !result.requiresAccountSetup,
    });
  };

  const otpFieldsProps = {
    phone,
    otp,
    secondsLeft,
    otpError,
    inputRefs,
    onDigitChange: updateDigit,
    onKeyDown: handleKeyDown,
    onResend: () => {
      void sendOtp();
    },
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const handleVerifyClick = () => {
    void handleVerify();
  };

  if (showMobileShell) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange} shouldScaleBackground={false}>
        <DrawerContent
          overlayClassName={CHECKOUT_OTP_OVERLAY_CLASS}
          className="flex max-h-[90vh] min-h-0 flex-col overflow-hidden rounded-none border-0 bg-white p-0 [&>div:first-child]:hidden"
        >
          <DrawerTitle className="sr-only">Enter OTP</DrawerTitle>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
            <div className="w-full shrink-0 px-4 pt-6">
              <div className="flex h-[26px] items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Go back"
                    className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M15.5 20L8 12.5L15.5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <h2 className="font-larken text-xl font-light leading-110 text-darkblack">Enter OTP</h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close OTP"
                  className="inline-flex size-8 shrink-0 items-center justify-center text-darkblack"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M24.667 6.66666L6.66699 24.6667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M24.667 24.6667L6.66699 6.66666" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-6 lg:pb-6 lg:pt-6">
              <CheckoutOtpFields {...otpFieldsProps} variant="mobile" />
            </div>

            <div className="relative shrink-0 border-t border-neutral300 bg-white pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
              <div
                className="pointer-events-none absolute inset-x-0 bottom-full h-[71px] bg-gradient-to-b from-transparent to-white"
                aria-hidden
              />
              <hr className="mb-6 border-neutral300" />
              <div className="w-full px-4">
                <CheckoutOtpVerifyButton
                  disabled={!isComplete}
                  loading={isVerifying}
                  onClick={handleVerifyClick}
                />
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hideCloseButton
        overlayClassName={CHECKOUT_OTP_OVERLAY_CLASS}
        className="z-[70] max-w-[560px] gap-0 border-0 bg-transparent p-0 shadow-none sm:rounded-none top-[231px] translate-x-[-50%] translate-y-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Enter OTP</DialogTitle>
        <CheckoutOtpDesktopPanel
          onClose={onClose}
          otpFieldsProps={otpFieldsProps}
          isComplete={isComplete}
          isVerifying={isVerifying}
          onVerify={handleVerifyClick}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutOtpModal;
