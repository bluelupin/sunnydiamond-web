"use client";

import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export const checkoutPaymentFailedToastMessage = "Payment failed. Try Again";

type CheckoutPaymentFailedToastProps = {
  open: boolean;
  onDismiss: () => void;
  className?: string;
};

/** Figma checkout — payment failed / gateway exit notification. */
const CheckoutPaymentFailedToast = ({
  open,
  onDismiss,
  className,
}: CheckoutPaymentFailedToastProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className={cn("flex justify-center", className)}>
      <div
        role="alert"
        aria-live="assertive"
        className="flex w-full max-w-[min(100%,520px)] items-center justify-between gap-3 border border-red600 bg-red100 px-4 py-3 h-12"
      >
        <div className="flex min-w-0 items-center gap-2">
          <AlertTriangle
            className="size-5 shrink-0 text-red600"
            strokeWidth={1.75}
            aria-hidden
          />
          <p className="font-gill text-sm font-normal leading-110 text-red600">
            {checkoutPaymentFailedToastMessage}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss payment failed message"
          className="inline-flex size-6 shrink-0 items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red600 focus-visible:ring-offset-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 18L6 6" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CheckoutPaymentFailedToast;
