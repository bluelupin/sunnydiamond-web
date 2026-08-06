"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";

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
    <div className={cn("flex items-center gap-2 justify-between", className)}>
      <p className="font-gill md:text-base text-sm font-light leading-110 text-darkblack">
        <span>{label} </span>
      </p>
      <div className="flex items-center gap-2">
        <p className="font-gill md:text-base text-sm font-light leading-110 text-darkblack">{jobCode}</p>
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
              <img src="/images/icons/copy-icon.svg" alt="" className="block size-full max-w-none" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CareersSuccessJobIdCopy;
