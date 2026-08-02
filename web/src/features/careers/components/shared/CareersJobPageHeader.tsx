"use client";

import type { CareerJob } from "@/features/careers/types";
import CareersJobIdChip from "./CareersJobIdChip";
import CareersJobMetaRow from "./CareersJobMetaRow";
import CareersPostedLabel from "./CareersPostedLabel";
import CareersShareIcon from "./CareersShareIcon";
import { cn } from "@/shared/utils/cn";

type CareersJobPageHeaderProps = {
  job: CareerJob;
  titleId: string;
  shareLabel?: string;
  onShare?: () => void;
  className?: string;
};

/** Figma 1480:2900 (mobile) + desktop job detail header. */
const CareersJobPageHeader = ({
  job,
  titleId,
  shareLabel = "Share",
  onShare,
  className,
}: CareersJobPageHeaderProps) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Mobile — title + share, meta, job ID + posted */}
      <div className="flex flex-col gap-6 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <h1
            id={titleId}
            className="min-w-0 font-larken text-2xl font-light leading-110 text-darkblack"
          >
            {job.title}
          </h1>
          {onShare ? (
            <button
              type="button"
              onClick={onShare}
              className="inline-flex size-6 shrink-0 items-center justify-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              aria-label={shareLabel}
            >
              <CareersShareIcon />
            </button>
          ) : null}
        </div>

        <CareersJobMetaRow job={job} className="w-full" />

        <div className="flex items-center justify-between gap-4">
          <CareersJobIdChip jobCode={job.jobCode} alwaysInline surface="listing" />
          <CareersPostedLabel
            postedAt={job.postedAt}
            className="shrink-0 font-gill text-sm font-light leading-110 text-neutral500"
          />
        </div>
      </div>

      {/* Desktop — title + chip + share, meta, posted aside */}
      <div className="hidden md:flex md:w-full md:items-start md:justify-between md:gap-6">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex w-full max-w-[571px] flex-wrap items-center justify-between gap-4">
            <h1
              id={titleId}
              className="font-larken text-32 font-light leading-110 text-darkblack"
            >
              {job.title}
            </h1>

            <div className="flex items-center gap-3">
              <CareersJobIdChip jobCode={job.jobCode} alwaysInline surface="muted" />
              {onShare ? (
                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex size-6 shrink-0 items-center justify-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
                  aria-label={shareLabel}
                >
                  <CareersShareIcon />
                </button>
              ) : null}
            </div>
          </div>

          <CareersJobMetaRow job={job} />
        </div>

        <CareersPostedLabel
          postedAt={job.postedAt}
          className="shrink-0 font-gill text-base font-light leading-110 text-neutral500"
        />
      </div>
    </div>
  );
};

export default CareersJobPageHeader;
