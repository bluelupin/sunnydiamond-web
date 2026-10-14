"use client";

import FilterIcon from "@/assets/Icons/PLP/FilterIcon";
import { jewelleryListingEmptyStateContent } from "../data/content";

type JewelleryListingEmptyStateProps = {
  onClearFilters?: () => void;
  title?: string;
  description?: string;
  clearFiltersLabel?: string;
  /** Filter empty shows the icon by default; search empty passes false. */
  showFilterIcon?: boolean;
};

const JewelleryListingEmptyState = ({
  onClearFilters,
  title,
  description,
  clearFiltersLabel,
  showFilterIcon = true,
}: JewelleryListingEmptyStateProps) => {
  const content = jewelleryListingEmptyStateContent;
  const resolvedTitle = title ?? content.filterTitle;
  const resolvedDescription = description ?? content.filterDescription;
  const resolvedClearLabel = clearFiltersLabel ?? content.clearFiltersLabel;

  return (
    <div className="flex w-full min-h-[min(400px,45vh)] items-center justify-center px-4 py-12 md:py-16">
      <div className="flex w-full max-w-[464px] flex-col items-center gap-6 text-center md:gap-8">
        {onClearFilters && showFilterIcon ? (
          <div className="flex size-16 items-center justify-center rounded-full bg-benefitSurface md:size-20" aria-hidden>
            <FilterIcon className="text-neutral500" />
          </div>
        ) : null}

        <div className="flex w-full flex-col gap-3">
          <h2 className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32">
            {resolvedTitle}
          </h2>
          <p className="font-gill text-base font-light leading-110 text-neutral500 lg:text-lg">
            {resolvedDescription}
          </p>
        </div>

        {onClearFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="btn-border-slide inline-flex h-14 w-full max-w-[280px] items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm uppercase leading-110 text-darkblack"
          >
            <span className="relative z-10">{resolvedClearLabel}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default JewelleryListingEmptyState;
