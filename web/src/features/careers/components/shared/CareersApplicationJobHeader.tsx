"use client";

import type { CareerJob } from "@/features/careers/types";
import CareersJobPageHeader from "./CareersJobPageHeader";

type CareersApplicationJobHeaderProps = {
  job: CareerJob;
  postedAt?: string;
  className?: string;
};

/** Application form header — no Share control (Figma apply form). Job detail keeps Share. */
const CareersApplicationJobHeader = ({
  job,
  postedAt,
  className,
}: CareersApplicationJobHeaderProps) => {
  const jobWithPosted = postedAt ? { ...job, postedAt } : job;

  return (
    <div className={className}>
      <CareersJobPageHeader job={jobWithPosted} titleId="careers-application-title" />

      <div className="mt-6 h-px w-full bg-neutral300" aria-hidden />
    </div>
  );
};

export default CareersApplicationJobHeader;
