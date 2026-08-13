"use client";

import { cn } from "@/shared/utils/cn";
import type { CareerJob } from "@/features/careers/types";
import CareersJobMetaIcon from "./CareersJobMetaIcon";

type CareersJobMetaRowProps = {
  job: Pick<CareerJob, "experienceLabel" | "location" | "department">;
  className?: string;
  iconClassName?: string;
};

const figmaMetaItemClass =
  "flex shrink-0 items-center gap-1.5 font-gill text-base font-light leading-110 text-darkblack";

const figmaMetaTextClass = "whitespace-nowrap";

const META_DIVIDER_SRC = "/icons/icon-meta-divider.svg";

function MetaDivider({ className }: { className?: string }) {
  return (
    <img
      src={META_DIVIDER_SRC}
      alt=""
      width={1}
      height={24}
      className={cn("h-6 w-px shrink-0 self-center", className)}
      aria-hidden
    />
  );
}

function FigmaMetaItem({
  icon,
  label,
  iconClassName,
}: {
  icon: "experience" | "map" | "workplace" | "department";
  label: string;
  iconClassName?: string;
}) {
  return (
    <span className={figmaMetaItemClass}>
      <CareersJobMetaIcon name={icon} className={iconClassName} />
      <span className={figmaMetaTextClass}>{label}</span>
    </span>
  );
}

const CareersJobMetaRow = ({
  job,
  className,
  iconClassName,
}: CareersJobMetaRowProps) => {
  const showExperience = Boolean(job.experienceLabel?.trim());
  const showDepartment = Boolean(job.department?.trim());

  return (
    <div
      className={cn(
        "flex flex-wrap content-center items-center gap-4 md:gap-6",
        className,
      )}
    >
      {showExperience ? (
        <>
          <FigmaMetaItem
            icon="experience"
            label={job.experienceLabel}
            iconClassName={iconClassName}
          />
          <MetaDivider />
        </>
      ) : null}
      <FigmaMetaItem icon="map" label={job.location} iconClassName={iconClassName} />
      {showDepartment ? (
        <>
          <MetaDivider />
          <FigmaMetaItem
            icon="department"
            label={job.department}
            iconClassName={iconClassName}
          />
        </>
      ) : null}
    </div>
  );
};

export default CareersJobMetaRow;
