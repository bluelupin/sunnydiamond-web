"use client";

import CareersSearchIcon from "./CareersSearchIcon";
import CareersSectionCta from "./CareersSectionCta";

type CareersJobListingsEmptyStateProps = {
  title: string;
  description?: string | null;
  clearFiltersLabel?: string | null;
  onClearFilters?: () => void;
};

const CareersJobListingsEmptyState = ({
  title,
  description,
  clearFiltersLabel,
  onClearFilters,
}: CareersJobListingsEmptyStateProps) => {
  return (
    <div className="flex w-full min-h-[min(400px,45vh)] items-center justify-center py-12 md:py-16">
      <div className="flex w-full max-w-[464px] flex-col items-center gap-6 text-center md:gap-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-benefitSurface md:size-20">
          <CareersSearchIcon className="size-8 md:size-10" />
        </div>

        <div className="flex w-full flex-col gap-3">
          <h3 className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32">
            {title}
          </h3>
          {description ? (
            <p className="font-gill text-base font-light leading-110 text-neutral500">
              {description}
            </p>
          ) : null}
        </div>

        {clearFiltersLabel && onClearFilters ? (
          <CareersSectionCta onClick={onClearFilters} variant="link">
            {clearFiltersLabel}
          </CareersSectionCta>
        ) : null}
      </div>
    </div>
  );
};

export default CareersJobListingsEmptyState;
