"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";

export const appStatusToastDurationMs = 4000;

type AppStatusToastProps = {
  open: boolean;
  message: string;
  action?: ReactNode;
};

/** Top-centered status toast — matches Add to Wishlist notification styling. */
const AppStatusToast = ({ open, message, action }: AppStatusToastProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[80] flex justify-center px-4 md:top-104">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto w-full max-w-[300px] animate-in fade-in slide-in-from-top-2 duration-300"
      >
        <div className="flex w-full items-center justify-between gap-3 bg-darkblack px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Check size={18} strokeWidth={1.25} aria-hidden className="shrink-0 text-white" />
            <p className="font-gill text-sm font-light leading-110 text-white">{message}</p>
          </div>
          {action}
        </div>
      </div>
    </div>
  );
};

export default AppStatusToast;
