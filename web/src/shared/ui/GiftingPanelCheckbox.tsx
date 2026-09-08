"use client";

import GiftingPanelCheckboxIcon from "@/assets/Icons/GiftingPanelCheckboxIcon";
import { cn } from "@/shared/utils/cn";

const GIFTING_PANEL_CHECKBOX_DIMENSION = {
  root: "size-[24px]",
  box: "size-[24px]",
  icon: "size-[24px]",
  labelRow: "h-[24px]",
  labelLeading: "leading-[24px]",
} as const;

export const GIFTING_PANEL_CHECKBOX_SIZES = {
  sm: GIFTING_PANEL_CHECKBOX_DIMENSION,
  md: GIFTING_PANEL_CHECKBOX_DIMENSION,
  lg: GIFTING_PANEL_CHECKBOX_DIMENSION,
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
  /** Classes for the visible checkbox wrapper. */
  boxClassName?: string;
  /** Classes for the checkbox SVG (e.g. `size-4`). */
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
        className={cn("pointer-events-none flex items-center justify-center", dimensionClass, boxClassName)}
        aria-hidden
      >
        <GiftingPanelCheckboxIcon
          checked={checked}
          className={cn(dimensions.icon, iconClassName)}
        />
      </span>
    </span>
  );
};

export default GiftingPanelCheckbox;
