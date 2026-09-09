"use client";

import { type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import {
  GIFTING_PANEL_CHECKBOX_SIZES,
  type GiftingPanelCheckboxSize,
} from "./GiftingPanelCheckbox";

/** Horizontal gap between checkbox and label (px). */
export const GIFTING_CHECKBOX_LABEL_GAP_CLASS = "gap-x-[8px]";

const GAP_CLASS = {
  2: GIFTING_CHECKBOX_LABEL_GAP_CLASS,
  3: "gap-x-3",
} as const;

type GiftingCheckboxLabelRowProps = {
  size?: GiftingPanelCheckboxSize;
  gap?: 2 | 3;
  className?: string;
  labelClassName?: string;
  checkbox: ReactNode;
  label: ReactNode;
};

/**
 * Cross-browser checkbox + label row. Uses CSS grid with a fixed row height and
 * matching line-height so text aligns with the checkbox on WebKit (iOS/macOS) as
 * well as Windows — flex + leading-none alone is unreliable with Gill Sans metrics.
 */
export const GiftingCheckboxLabelRow = ({
  size = "md",
  gap = 2,
  className,
  labelClassName,
  checkbox,
  label,
}: GiftingCheckboxLabelRowProps) => {
  const dimensions = GIFTING_PANEL_CHECKBOX_SIZES[size];

  return (
    <span
      className={cn(
        "grid w-fit grid-cols-[auto_auto] items-center",
        GAP_CLASS[gap],
        dimensions.labelRow,
        className,
      )}
    >
      {checkbox}
      <span
        className={cn(
          "m-0 self-center font-gill text-base font-normal text-darkblack",
          dimensions.labelLeading,
          labelClassName,
        )}
      >
        {label}
      </span>
    </span>
  );
};
