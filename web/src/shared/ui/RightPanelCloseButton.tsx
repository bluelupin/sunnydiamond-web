"use client";

import { cn } from "@/shared/utils/cn";
import {
  RIGHT_PANEL_CLOSE_ABSOLUTE_CLASS,
  RIGHT_PANEL_INLINE_CLOSE_CLASS,
} from "./rightPanel";

type RightPanelCloseButtonProps = {
  onClick: () => void;
  "aria-label": string;
  variant?: "absolute" | "inline";
  className?: string;
  light?: boolean;
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

export function RightPanelCloseButton({
  onClick,
  "aria-label": ariaLabel,
  variant = "inline",
  className,
  light = false,
}: RightPanelCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        variant === "absolute" ? RIGHT_PANEL_CLOSE_ABSOLUTE_CLASS : RIGHT_PANEL_INLINE_CLOSE_CLASS,
        light ? "text-white" : "text-darkblack",
        className,
      )}
    >
      <CloseIcon />
    </button>
  );
}
