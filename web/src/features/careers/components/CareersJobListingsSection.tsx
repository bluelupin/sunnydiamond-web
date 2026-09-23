"use client";

import { useEffect, useState } from "react";
import FilterIcon from "@/assets/Icons/PLP/FilterIcon";
import CareersSearchIcon from "@/features/careers/components/shared/CareersSearchIcon";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import JewelleryLoadMoreSection from "@/features/jewellery-product/components/JewelleryLoadMoreSection";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersJobCard from "./shared/CareersJobCard";
import CareersJobFiltersSidebar from "./shared/CareersJobFiltersSidebar";
import CareersJobFiltersDrawer from "./shared/CareersJobFiltersDrawer";
import CareersJobListingsEmptyState from "./shared/CareersJobListingsEmptyState";
import CareersOpeningsEmptyState from "./shared/CareersOpeningsEmptyState";
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
    jobs,
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
  const searchPlaceholder = "Search Roles";
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

  if (jobs.length === 0) {
    return (
      <section
        id="job-listing"
        aria-labelledby="careers-openings-empty-title"
        className="bg-white px-4 py-10 md:px-10 md:py-104"
      >
        <CareersOpeningsEmptyState />
      </section>
    );
  }

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
        <CareersJobFiltersSidebar />

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
              <div
                className={cn(
                  "flex h-12 min-w-0 flex-1 items-center gap-4 border border-[#F2F2F2] bg-[#F2F2F2] p-3",
                  "focus-within:outline-none focus-within:ring-2 focus-within:ring-darkblack focus-within:ring-offset-2",
                )}
              >
                <CareersSearchIcon className="h-[22px] w-6 shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent font-gill text-sm font-light leading-110 text-darkblack placeholder:text-darkblack outline-none"
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
