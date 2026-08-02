"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const COPY_ICON_SRC = "/images/careers/copy-icon.svg";

type CareersSuccessJobIdCopyProps = {
  jobCode: string;
  label: string;
  className?: string;
};

const CareersSuccessJobIdCopy = ({ jobCode, label, className }: CareersSuccessJobIdCopyProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jobCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <p className="font-gill text-base font-light leading-110 text-darkblack">
        <span>{label} </span>
        <span>{jobCode}</span>
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="relative size-6 shrink-0 overflow-clip text-darkblack transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
        aria-label={`Copy job ID ${jobCode}`}
      >
        {copied ? (
          <Check className="absolute inset-0 m-auto size-4" strokeWidth={1.5} aria-hidden />
        ) : (
          <span className="absolute inset-[16.67%_14.58%_14.58%_16.67%]">
            <img src={COPY_ICON_SRC} alt="" className="block size-full max-w-none" />
          </span>
        )}
      </button>
    </div>
  );
};

export default CareersSuccessJobIdCopy;
