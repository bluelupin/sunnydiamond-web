"use client";

import type { CareerJob } from "@/features/careers/types";
import CareersJobPageHeader from "./CareersJobPageHeader";

type CareersApplicationJobHeaderProps = {
  job: CareerJob;
  shareLabel?: string;
  onShare?: () => void;
  postedAt?: string;
  className?: string;
};

const CareersApplicationJobHeader = ({
  job,
  shareLabel = "Share",
  onShare,
  postedAt,
  className,
}: CareersApplicationJobHeaderProps) => {
  const jobWithPosted = postedAt ? { ...job, postedAt } : job;

  return (
    <div className={className}>
      <CareersJobPageHeader
        job={jobWithPosted}
        titleId="careers-application-title"
        shareLabel={shareLabel}
        onShare={onShare}
      />

      <div className="mt-6 h-px w-full bg-neutral300" aria-hidden />
    </div>
  );
};

export default CareersApplicationJobHeader;
