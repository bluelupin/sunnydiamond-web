"use client";

import { useEffect, useState, type AnimationEvent, type ReactNode } from "react";
import { Check } from "lucide-react";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { cn } from "@/shared/utils/cn";

export const appStatusToastDurationMs = 4000;

const appStatusToastAnimationMs = 300;

type AppStatusToastProps = {
  open: boolean;
  message: string;
  action?: ReactNode;
};

type AppStatusToastActionProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
};

type ToastPhase = "hidden" | "enter" | "visible" | "exit";

/** Tertiary CTA for dark AppStatusToast — matches DetailTextLink hover underline animation. */
export const AppStatusToastAction = ({
  children,
  href,
  onClick,
  className,
}: AppStatusToastActionProps) => (
  <DetailTextLink href={href} onClick={onClick} light className={cn("shrink-0", className)}>
    {children}
  </DetailTextLink>
);

/** Top-centered status toast — matches Add to Wishlist notification styling. */
const AppStatusToast = ({ open, message, action }: AppStatusToastProps) => {
  const [phase, setPhase] = useState<ToastPhase>("hidden");
  const [displayContent, setDisplayContent] = useState({ message, action });

  useEffect(() => {
    if (open) {
      setDisplayContent({ message, action });
      setPhase((current) => (current === "hidden" || current === "exit" ? "enter" : current));
      return;
    }

    setPhase((current) => (current === "hidden" ? "hidden" : "exit"));
  }, [open, message, action]);

  useEffect(() => {
    if (phase !== "enter" && phase !== "exit") {
      return;
    }

    const timer = window.setTimeout(() => {
      setPhase((current) => {
        if (current === "enter") {
          return "visible";
        }

        if (current === "exit") {
          return "hidden";
        }

        return current;
      });
    }, appStatusToastAnimationMs);

    return () => window.clearTimeout(timer);
  }, [phase]);

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target) {
      return;
    }

    setPhase((current) => {
      if (current === "enter") {
        return "visible";
      }

      if (current === "exit") {
        return "hidden";
      }

      return current;
    });
  };

  if (phase === "hidden") {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[80] flex justify-center px-4 md:top-104">
      <div
        role="status"
        aria-live="polite"
        onAnimationEnd={handleAnimationEnd}
        className={cn(
          "pointer-events-auto w-full max-w-[300px]",
          phase === "enter" &&
            "animate-in fade-in slide-in-from-top-4 duration-300 ease-out",
          phase === "exit" &&
            "animate-out fade-out slide-out-to-top-4 duration-300 ease-in",
        )}
      >
        <div
          className={cn(
            "flex w-full items-center gap-3 bg-darkblack px-4 py-3",
            displayContent.action ? "justify-between" : "justify-center",
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Check size={18} strokeWidth={1.25} aria-hidden className="shrink-0 text-white" />
            <p className="min-w-0 text-center font-gill text-sm font-light leading-110 text-white">
              {displayContent.message}
            </p>
          </div>
          {displayContent.action}
        </div>
      </div>
    </div>
  );
};

export default AppStatusToast;
