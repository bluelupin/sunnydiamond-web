"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { CartPrimaryButton } from "@/features/cart/components/CartFlowUi";

type CheckoutOtpModalProps = {
  open: boolean;
  phone: string;
  onClose: () => void;
  onVerify: () => void;
};

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "+91 ******";
  return `+91 ${digits.slice(0, 2)}******${digits.slice(-2)}`;
};

const CheckoutOtpModal = ({ open, phone, onClose, onVerify }: CheckoutOtpModalProps) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) {
      setOtp(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(RESEND_SECONDS);
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

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

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close OTP modal"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
      />
      <div className="relative flex h-full w-full items-center justify-center px-5 py-8 max-lg:min-h-0 max-lg:py-6 lg:items-start lg:px-4 lg:pt-[231px]">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enter OTP"
          className="relative z-10 flex w-full max-w-[560px] flex-col gap-6 bg-white p-6 max-lg:max-h-[calc(100vh-3rem)] max-lg:overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">Enter OTP</h2>
            <button type="button" onClick={onClose} aria-label="Close">
              <X className="size-6 text-darkblack" />
            </button>
          </div>

          <div className="flex flex-col items-end gap-4">
            <p className="w-full font-gill text-base font-light leading-110 text-darkblack">
              Please enter the OTP sent to {maskPhone(phone)}
            </p>
            <div className="flex w-full gap-1">
              {otp.map((digit, index) => (
                <div
                  key={index}
                  className="relative flex h-20 flex-1 items-center justify-center bg-aboutInactive"
                >
                  <input
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => updateDigit(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    className="absolute inset-0 bg-transparent text-center font-gill text-base lg:text-xl leading-110 text-darkblack outline-none"
                    aria-label={`OTP digit ${index + 1}`}
                  />
                  {!digit ? <span className="size-2 rounded-full bg-gray50" aria-hidden /> : null}
                </div>
              ))}
            </div>
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              {secondsLeft > 0
                ? `Resend code in 00:${secondsLeft.toString().padStart(2, "0")}`
                : "Resend code"}
            </p>
          </div>
          <hr className="border-neutral300" />
          <CartPrimaryButton
            type="button"
            className="w-full uppercase"
            disabled={!isComplete}
            onClick={onVerify}
          >
            Verify
          </CartPrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOtpModal;
