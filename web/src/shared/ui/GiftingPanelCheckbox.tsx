"use client";

import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export const GIFTING_PANEL_CHECKBOX_SIZES = {
  sm: { root: "size-4", box: "size-4", icon: "size-2.5", labelRow: "h-4" },
  md: { root: "size-5", box: "size-5", icon: "size-3", labelRow: "h-5" },
  lg: { root: "size-6", box: "size-6", icon: "size-4", labelRow: "h-6" },
} as const;

export type GiftingPanelCheckboxSize = keyof typeof GIFTING_PANEL_CHECKBOX_SIZES;

type GiftingPanelCheckboxProps = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Preset dimensions — override with `sizeClassName`, `boxClassName`, or `iconClassName`. */
  size?: GiftingPanelCheckboxSize;
  /** Tailwind size utility applied to both the hit area and checkbox box (e.g. `size-7`). */
  sizeClassName?: string;
  /** Classes for the outer hit-area wrapper. */
  className?: string;
  /** Classes for the visible checkbox box (e.g. `size-7` for a custom size). */
  boxClassName?: string;
  /** Classes for the check icon (e.g. `size-4`). */
  iconClassName?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

const GiftingPanelCheckbox = ({
  id,
  checked,
  onChange,
  size = "md",
  sizeClassName,
  className,
  boxClassName,
  iconClassName,
  disabled = false,
  "aria-label": ariaLabel,
}: GiftingPanelCheckboxProps) => {
  const dimensions = GIFTING_PANEL_CHECKBOX_SIZES[size];
  const dimensionClass = sizeClassName ?? dimensions.box;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center leading-none",
        dimensionClass,
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.checked)}
        className="absolute inset-0 z-10 m-0 cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
      />
      <span
        className={cn(
          "flex items-center justify-center border border-gray600 bg-transparent",
          dimensionClass,
          checked && "border-transparent bg-linkGold",
          boxClassName,
        )}
        aria-hidden
      >
        <Check
          className={cn(
            "text-white transition-opacity",
            dimensions.icon,
            checked ? "opacity-100" : "opacity-0",
            iconClassName,
          )}
          strokeWidth={2.5}
        />
      </span>
    </span>
  );
};

export default GiftingPanelCheckbox;
