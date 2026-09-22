"use client";

import { useEffect, useState, type AnimationEvent } from "react";
import { cn } from "@/shared/utils/cn";

export const profileAddressToastDurationMs = 4000;
export const profileAddressToastWithUndoDurationMs = 8000;

const profileAddressToastAnimationMs = 300;

type ToastPhase = "hidden" | "enter" | "visible" | "exit";

type ProfileAddressToastProps = {
  open: boolean;
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
  onDismiss: () => void;
};

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M18.5 5L5 18.5"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 18.5L5 5"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Address-module toast — Figma 1480:42260 (message, optional UNDO, close). */
export function ProfileAddressToast({
  open,
  message,
  undoLabel,
  onUndo,
  onDismiss,
}: ProfileAddressToastProps) {
  const [phase, setPhase] = useState<ToastPhase>("hidden");
  const [displayContent, setDisplayContent] = useState({
    message,
    undoLabel,
    onUndo,
  });

  useEffect(() => {
    if (open) {
      setDisplayContent({ message, undoLabel, onUndo });
      setPhase((current) => (current === "hidden" || current === "exit" ? "enter" : current));
      return;
    }

    setPhase((current) => (current === "hidden" ? "hidden" : "exit"));
  }, [open, message, undoLabel, onUndo]);

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
    }, profileAddressToastAnimationMs);

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

  const showUndo = Boolean(displayContent.onUndo && displayContent.undoLabel);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[80] flex justify-center px-4 md:top-104">
      <div
        role="status"
        aria-live="polite"
        onAnimationEnd={handleAnimationEnd}
        className={cn(
          "pointer-events-auto w-fit max-w-[calc(100vw-2rem)]",
          phase === "enter" &&
            "animate-in fade-in slide-in-from-top-4 duration-300 ease-out",
          phase === "exit" &&
            "animate-out fade-out slide-out-to-top-4 duration-300 ease-in",
        )}
      >
        <div className="flex w-fit items-center justify-between gap-8 bg-darkblack px-4 py-3">
          <div className="flex items-center gap-3">
            <p className="whitespace-nowrap font-gill text-sm font-normal leading-110 text-white">
              {displayContent.message}
            </p>
            {showUndo ? (
              <button
                type="button"
                onClick={displayContent.onUndo}
                className="shrink-0 border-b border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white"
              >
                {displayContent.undoLabel}
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="shrink-0 text-white"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
