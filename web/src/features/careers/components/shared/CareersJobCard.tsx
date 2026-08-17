"use client";

import { cn } from "@/shared/utils/cn";
import type { CareerJob } from "@/features/careers/types";
import {
  careersDarkCtaClassName,
  careersOutlineCtaClassName,
} from "@/features/careers/constants/careersCtaStyles";
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

const viewJobButtonClass = cn(
  careersDarkCtaClassName,
  "w-fit shrink-0",
);

const viewJobOutlineButtonClass = cn(
  careersOutlineCtaClassName,
  "w-fit shrink-0 border-darkblack bg-transparent text-darkblack md:px-8",
);

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
  const viewJobLabel =
    cms.landing.applicationFlow?.jobDetails.viewJobLabel ?? "VIEW JOB";
  const isLanding = variant === "landing";
  const isListing = variant === "listing";
  const isInteractive = (isLanding || isListing) && Boolean(onViewJob);
  const shouldShowViewJob = showViewJobButton ?? Boolean(onViewJob);
  const useOutlineViewJob = !isLanding && !isListing;

  const handleCardActivate = () => {
    if (isInteractive && onViewJob) {
      onViewJob();
    }
  };

  const postedDesktopClass =
    "font-gill text-base font-light leading-110 text-darkblack";
  const postedMobileListingClass =
    "font-gill text-sm font-light leading-normal tracking-[0.12px] text-[#7A7A7A]";

  return (
    <article
      onClick={isInteractive ? handleCardActivate : undefined}
      onKeyDown={(event) => {
        if (!isInteractive || !onViewJob) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onViewJob();
        }
      }}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={cn(
        "flex flex-col",
        isLanding &&
          cn(
            "gap-6 bg-gray200 p-4 md:bg-gray300 md:p-6",
            isInteractive &&
              "group cursor-pointer transition-colors md:flex-row md:items-start md:justify-between",
          ),
        isListing &&
          "group cursor-pointer gap-6 bg-gray300 p-4 transition-colors md:bg-gray200 md:p-6 md:flex-row md:items-start md:justify-between md:hover:bg-gray300",
        !isLanding && !isListing && "gap-6 bg-gray200 p-4 md:gap-8 md:p-8",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-6", isInteractive && "min-w-0 md:flex-1")}>
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              "flex items-center gap-3",
              isLanding && "flex-wrap gap-3 md:flex-row",
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
              isLanding && "hidden lg:block",
              isListing && "hidden lg:block",
              isListing ? postedDesktopClass : "",
              !isListing &&
                (isLanding ? postedDesktopClass : "text-sm text-neutral500 md:text-base"),
            )}
          />
        ) : null}
      </div>

      {shouldShowViewJob && onViewJob ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onViewJob();
          }}
          className={cn(
            useOutlineViewJob ? viewJobOutlineButtonClass : viewJobButtonClass,
            isInteractive && "lg:hidden lg:group-hover:inline-flex",
          )}
        >
          <span className="relative z-10">{viewJobLabel}</span>
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
