"use client";

import { cn } from "@/shared/utils/cn";
import { formatCareersFileSize } from "@/features/careers/constants/careersApplicationForm";

const DOCUMENT_ICON_SRC = "/icons/icon-resume-document.svg";
const FOLD_ICON_SRC = "/icons/icon-resume-fold.svg";
const REMOVE_ICON_SRC = "/icons/icon-resume-remove.svg";

/** Figma 1480:1040 — PDF/document glyph in resume file chip. */
function CareersResumeFileIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative h-[39.385px] w-[36.923px] shrink-0 overflow-clip",
        className,
      )}
      aria-hidden
    >
      <span className="absolute inset-[19.23%_17.71%_17.31%_16.67%]">
        <span className="absolute inset-[-3.08%_-3.17%_-3.08%_-3.18%]">
          <img src={DOCUMENT_ICON_SRC} alt="" className="block size-full max-w-none" />
        </span>
      </span>
      <span className="absolute left-[17.5px] top-[18.5px] h-0 w-px">
        <span className="absolute inset-[-0.77px_-50%]">
          <img src={FOLD_ICON_SRC} alt="" className="block size-full max-w-none" />
        </span>
      </span>
    </span>
  );
}

type CareersResumeFileChipProps = {
  fileName: string;
  fileSize: number;
  onRemove: () => void;
  removeLabel?: string;
  className?: string;
};

/** Figma 1480:1038 — uploaded resume file row. */
const CareersResumeFileChip = ({
  fileName,
  fileSize,
  onRemove,
  removeLabel = "Remove resume",
  className,
}: CareersResumeFileChipProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-10 bg-[#ECE9E9] px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <CareersResumeFileIcon />
        <div className="flex w-[146px] min-w-0 flex-col gap-2 leading-110">
          <p className="truncate font-gill text-base font-normal text-darkblack">
            {fileName}
          </p>
          <p className="font-gill text-sm font-light text-neutral500">
            {formatCareersFileSize(fileSize)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="relative size-5 shrink-0 overflow-hidden text-darkblack transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
        aria-label={removeLabel}
      >
        <span className="absolute inset-1/4">
          <img src={REMOVE_ICON_SRC} alt="" className="block size-full max-w-none" />
        </span>
      </button>
    </div>
  );
};

export default CareersResumeFileChip;
