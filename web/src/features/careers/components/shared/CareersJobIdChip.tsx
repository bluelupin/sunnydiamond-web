"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { copyCareerJobId } from "@/features/careers/utils/copyCareerJobId";
type CareersJobIdChipProps = {
  jobCode: string;
  className?: string;
  alwaysInline?: boolean;
  surface?: "white" | "muted" | "listing";
};

function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <span className="relative size-6 shrink-0 overflow-hidden" aria-hidden>
      {copied ? (
        <Check className="absolute inset-0 m-auto size-4 text-darkblack" strokeWidth={1.5} />
      ) : (
        <span className="absolute inset-[16.67%_14.58%_14.58%_16.67%]">
          <img src="/icons/copy-icon.svg" alt="" className="block size-full max-w-none" />
        </span>
      )}
    </span>
  );
}

const CareersJobIdChip = ({
  jobCode,
  className,
  alwaysInline = false,
  surface = "white",
}: CareersJobIdChipProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const didCopy = await copyCareerJobId(jobCode);
    if (!didCopy) {
      setCopied(false);
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (alwaysInline) {
    // Open Roles listing: white chip on beige cards.
    // Job detail header (`muted`): grey chip on white page.
    const surfaceClassName =
      surface === "muted"
        ? "bg-chalk300 hover:bg-[#e2dede]"
        : "bg-white hover:bg-white";

    return (
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          // Figma: 8px gap, 12×4 padding (`px-3 py-1`).
          "inline-flex shrink-0 items-center gap-2 px-3 py-1",
          surfaceClassName,
          "font-gill text-sm font-light leading-110 text-darkblack md:text-base",
          "transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
          className,
        )}
        aria-label={`Copy job ID ${jobCode}`}
      >
        <span className="whitespace-nowrap">Job ID: {jobCode}</span>
        <CopyIcon copied={copied} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 bg-[#ECE9E9] px-3 py-1",
        "font-gill text-base font-light leading-110 text-darkblack",
        "transition-colors hover:bg-[#e2dede]",
        "md:gap-2 md:border md:border-neutral300 md:bg-white md:px-3 md:py-2 md:font-normal md:hover:border-darkblack/40 md:hover:bg-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
        className,
      )}
      aria-label={`Copy job ID ${jobCode}`}
    >
      <span className="md:hidden">Job ID: {jobCode}</span>
      <span className="hidden text-neutral500 md:inline">Job ID</span>
      <span className="hidden md:inline">{jobCode}</span>
      <CopyIcon copied={copied} />
    </button>
  );
};

export default CareersJobIdChip;
