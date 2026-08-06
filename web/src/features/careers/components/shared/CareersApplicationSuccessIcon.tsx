"use client";

import { cn } from "@/shared/utils/cn";

const SUCCESS_ICON_SRC = "/images/icons/icon-application-success.svg";

/** Figma 1480:857 — green checkmark for application success. */
const CareersApplicationSuccessIcon = ({ className }: { className?: string }) => {
  return (
    <span className={cn("relative size-10 shrink-0", className)} aria-hidden>
      <span className="absolute inset-[-2.35%]">
        <img src={SUCCESS_ICON_SRC} alt="" className="block size-full max-w-none" />
      </span>
    </span>
  );
};

export default CareersApplicationSuccessIcon;
