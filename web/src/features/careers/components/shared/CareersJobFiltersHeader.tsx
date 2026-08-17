"use client";

import type { ReactNode } from "react";
import {
  CAREERS_LISTING_CLEAR_FILTERS_LABEL,
  hasActiveListingFilters,
} from "@/features/careers/constants/careersListing";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersSectionCta from "./CareersSectionCta";

type CareersJobFiltersHeaderProps = {
  title: string;
  trailing?: ReactNode;
  showClearAction?: boolean;
};

const CareersJobFiltersHeader = ({
  title,
  trailing,
  showClearAction = true,
}: CareersJobFiltersHeaderProps) => {
  const {
    searchQuery,
    locationFilter,
    departmentFilter,
    experienceFilter,
    clearListingFilters,
  } = useCareersJobs();

  const hasActiveFilters = hasActiveListingFilters(
    searchQuery,
    locationFilter,
    departmentFilter,
    experienceFilter,
  );

  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className="min-w-0 font-larken text-2xl font-light leading-110 text-darkblack">
        {title}
      </h3>
      <div className="flex shrink-0 items-center gap-4">
        {showClearAction && hasActiveFilters ? (
          <CareersSectionCta onClick={clearListingFilters} variant="link" className="shrink-0">
            {CAREERS_LISTING_CLEAR_FILTERS_LABEL}
          </CareersSectionCta>
        ) : null}
        {trailing}
      </div>
    </div>
  );
};

export default CareersJobFiltersHeader;
