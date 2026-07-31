"use client";

import { cn } from "@/shared/utils/cn";
import type { CareerJob } from "@/features/careers/types";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersJobIdChip from "./CareersJobIdChip";
import CareersJobMetaRow from "./CareersJobMetaRow";
import CareersPostedLabel from "./CareersPostedLabel";

type CareersJobCardVariant = "landing" | "listing";

type CareersJobCardProps = {
  job: CareerJob;
  variant: CareersJobCardVariant;
  isFeatured?: boolean;
  onViewJob?: () => void;
  className?: string;
  showPosted?: boolean;
  showSummary?: boolean;
  showViewJobButton?: boolean;
};

const viewJobButtonClass =
  "inline-flex h-14 w-fit shrink-0 items-center justify-center px-7 font-gill text-sm font-normal uppercase leading-110 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 bg-darkblack text-white hover:opacity-90";

const CareersJobCard = ({
  job,
  variant,
  onViewJob,
  className,
  showPosted = variant === "listing" || variant === "landing",
  showSummary = variant !== "landing" && variant !== "listing",
  showViewJobButton,
}: CareersJobCardProps) => {
  const { cms } = useCareersJobs();
  const viewJobLabel = cms.landing.applicationFlow?.jobDetails.viewJobLabel;
  const isLanding = variant === "landing";
  const isListing = variant === "listing";
  const shouldShowViewJob = showViewJobButton ?? Boolean(onViewJob);

  const handleCardActivate = () => {
    if (isListing && onViewJob) {
      onViewJob();
    }
  };

  const postedDesktopClass =
    "font-gill text-base font-light leading-110 text-darkblack";
  const postedMobileListingClass =
    "font-gill text-xs font-light leading-normal tracking-[0.12px] text-[#7A7A7A]";

  return (
    <article
      onClick={isListing ? handleCardActivate : undefined}
      onKeyDown={(event) => {
        if (!isListing || !onViewJob) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onViewJob();
        }
      }}
      role={isListing ? "button" : undefined}
      tabIndex={isListing ? 0 : undefined}
      className={cn(
        "flex flex-col",
        isLanding && "gap-6 bg-gray300 p-6",
        isListing &&
          "group cursor-pointer gap-6 bg-gray300 p-4 transition-colors md:bg-gray200 md:p-6 md:hover:flex-row md:hover:items-start md:hover:justify-between md:hover:bg-gray300",
        !isLanding && !isListing && "gap-6 bg-gray200 p-4 md:gap-8 md:p-8",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-6", isListing && "min-w-0 md:flex-1")}>
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              "flex items-center gap-3",
              isLanding && "flex-wrap md:flex-row",
              isListing && "flex-wrap",
              !isLanding && !isListing && "flex-wrap md:flex-col md:items-start md:gap-4",
            )}
          >
            <h3
              className={cn(
                "font-gill font-normal leading-110 text-darkblack",
                isLanding && "text-base md:text-xl",
                isListing && "text-base md:text-xl",
                !isLanding && !isListing && "text-base md:font-larken md:text-2xl md:font-light lg:text-32",
              )}
            >
              {job.title}
            </h3>
            <CareersJobIdChip
              jobCode={job.jobCode}
              alwaysInline={isLanding || isListing}
              surface={isListing ? "listing" : isLanding ? "muted" : "white"}
            />
          </div>

          {showSummary ? (
            <p className="hidden font-gill text-base font-light leading-110 text-neutral500 md:block md:text-xl">
              {job.summary}
            </p>
          ) : null}

          <CareersJobMetaRow job={job} />
        </div>

        {showPosted ? (
          <CareersPostedLabel
            postedAt={job.postedAt}
            className={cn(
              isListing && "hidden md:block",
              isListing ? postedDesktopClass : "",
              !isListing &&
                (isLanding ? postedDesktopClass : "text-sm text-neutral500 md:text-base"),
            )}
          />
        ) : null}
      </div>

      {shouldShowViewJob && onViewJob && viewJobLabel ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onViewJob();
          }}
          className={cn(
            viewJobButtonClass,
            isListing && "md:hidden md:group-hover:inline-flex",
            !isListing &&
              "md:border md:border-darkblack md:bg-transparent md:px-8 md:text-darkblack md:hover:bg-darkblack md:hover:text-white",
            isLanding && "md:hidden",
          )}
        >
          {viewJobLabel}
        </button>
      ) : null}

      {showPosted && isListing ? (
        <CareersPostedLabel
          postedAt={job.postedAt}
          className={cn(postedMobileListingClass, "md:hidden")}
        />
      ) : null}
    </article>
  );
};

export default CareersJobCard;
