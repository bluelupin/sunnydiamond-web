"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import FilterIcon from "@/assets/Icons/PLP/FilterIcon";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import JewelleryLoadMoreSection from "@/features/jewellery-product/components/JewelleryLoadMoreSection";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersJobCard from "./shared/CareersJobCard";
import CareersJobFiltersSidebar from "./shared/CareersJobFiltersSidebar";
import CareersJobFiltersDrawer from "./shared/CareersJobFiltersDrawer";
import CareersJobListingsEmptyState from "./shared/CareersJobListingsEmptyState";
import {
  CAREERS_LISTING_CLEAR_FILTERS_LABEL,
  CAREERS_LISTING_PAGE_SIZE,
  hasActiveListingFilters,
} from "@/features/careers/constants/careersListing";

const LISTING_FILTER_EMPTY_TITLE = "No matching roles found";
const LISTING_FILTER_EMPTY_DESCRIPTION =
  "Try adjusting your search or filters to see all open positions.";

const CareersJobListingsSection = () => {
  const {
    filteredJobs,
    searchQuery,
    setSearchQuery,
    goToDetail,
    cms,
    locationFilter,
    departmentFilter,
    experienceFilter,
    clearListingFilters,
  } = useCareersJobs();
  const { listing } = cms;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(CAREERS_LISTING_PAGE_SIZE);

  const listingHeading = listing.featuredTitle ?? listing.title;
  const searchPlaceholder = "Search roles";
  const hasActiveFilters = hasActiveListingFilters(
    searchQuery,
    locationFilter,
    departmentFilter,
    experienceFilter,
  );
  const showFilterEmptyState = filteredJobs.length === 0 && hasActiveFilters;
  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  useEffect(() => {
    setVisibleCount(CAREERS_LISTING_PAGE_SIZE);
  }, [searchQuery, locationFilter, departmentFilter, experienceFilter]);

  if (!listingHeading || !searchPlaceholder) {
    return null;
  }

  return (
    <section
      id="job-listing"
      aria-labelledby="careers-job-listing-title"
      className="bg-white px-4 py-10 md:px-10 md:py-104"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
        <Reveal direction="up" className="hidden lg:block">
          <CareersJobFiltersSidebar />
        </Reveal>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Reveal direction="up">
            <h2
              id="careers-job-listing-title"
              className="font-larken text-32 font-light leading-110 text-darkblack"
            >
              {listingHeading}
            </h2>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal direction="up" className="flex items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-darkblack"
                  aria-hidden
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    "h-12 w-full border border-[#F2F2F2] bg-[#F2F2F2] p-3 pl-12 font-gill text-sm font-light leading-110 text-darkblack placeholder:text-darkblack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
                  )}
                  aria-label={searchPlaceholder}
                />
              </div>
              {(listing.openFiltersLabel ?? listing.filtersTitle) ? (
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex size-12 shrink-0 items-center justify-center border border-[#F2F2F2] bg-[#F2F2F2] text-darkblack transition-colors hover:bg-gray300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 lg:hidden"
                  aria-label={listing.openFiltersLabel ?? listing.filtersTitle ?? "Filters"}
                >
                  <FilterIcon className="size-6" />
                </button>
              ) : null}
            </Reveal>

            <div className="flex flex-col gap-4">
              {visibleJobs.length > 0 ? (
                visibleJobs.map((job, index) => (
                  <Reveal key={job.id} direction="up" delay={index * 0.03}>
                    <CareersJobCard
                      job={job}
                      variant="listing"
                      onViewJob={() => goToDetail(job.id)}
                    />
                  </Reveal>
                ))
              ) : showFilterEmptyState ? (
                <Reveal direction="up">
                  <CareersJobListingsEmptyState
                    title={LISTING_FILTER_EMPTY_TITLE}
                    description={
                      listing.emptyResultsMessage ?? LISTING_FILTER_EMPTY_DESCRIPTION
                    }
                    clearFiltersLabel={CAREERS_LISTING_CLEAR_FILTERS_LABEL}
                    onClearFilters={clearListingFilters}
                  />
                </Reveal>
              ) : null}
            </div>

            {filteredJobs.length > 0 ? (
              <JewelleryLoadMoreSection
                visibleCount={visibleJobs.length}
                totalCount={filteredJobs.length}
                hasMore={hasMore}
                itemLabel="Openings"
                onLoadMore={() =>
                  setVisibleCount((count) => count + CAREERS_LISTING_PAGE_SIZE)
                }
              />
            ) : null}
          </div>
        </div>
      </div>

      {listing.filtersTitle ? (
        <CareersJobFiltersDrawer open={filtersOpen} onOpenChange={setFiltersOpen} />
      ) : null}
    </section>
  );
};

export default CareersJobListingsSection;
