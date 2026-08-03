"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/utils/cn";

const COPY_ICON_SRC = "/images/careers/copy-icon.svg";

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
          <img src={COPY_ICON_SRC} alt="" className="block size-full max-w-none" />
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

    try {
      await navigator.clipboard.writeText(jobCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (alwaysInline) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 px-3 py-1 bg-white",
          "font-gill text-base font-light leading-110 text-darkblack",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
          surface === "muted" &&
            "bg-[#ECE9E9] text-sm font-light hover:bg-[#ECE9E9] md:bg-white md:text-base",
          surface === "listing" &&
            "bg-[#ECE9E9] text-sm font-light hover:bg-[#ECE9E9] md:text-base",
          surface === "white" && "bg-white hover:bg-white",
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
