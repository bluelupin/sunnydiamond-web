"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import FilterIcon from "@/assets/Icons/PLP/FilterIcon";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import { careersPageContent } from "@/features/careers/data/content";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersJobCard from "./shared/CareersJobCard";
import CareersJobFiltersSidebar from "./shared/CareersJobFiltersSidebar";
import CareersJobFiltersDrawer from "./shared/CareersJobFiltersDrawer";

const CareersJobListingsSection = () => {
  const { jobListing } = careersPageContent;
  const { filteredJobs, searchQuery, setSearchQuery, goToDetail } = useCareersJobs();
  const [filtersOpen, setFiltersOpen] = useState(false);

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
              {jobListing.title}
            </h2>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal direction="up" className="flex items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-6 -translate-y-1/2 text-darkblack"
                  aria-hidden
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={jobListing.searchPlaceholder}
                  className={cn(
                    "h-auto w-full border border-[#F2F2F2] bg-[#F2F2F2] p-3 pl-12 font-gill text-sm font-light leading-110 text-darkblack placeholder:text-darkblack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
                  )}
                  aria-label={jobListing.searchPlaceholder}
                />
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex size-12 shrink-0 items-center justify-center border border-[#F2F2F2] bg-[#F2F2F2] text-darkblack transition-colors hover:bg-gray300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 lg:hidden"
                aria-label={jobListing.openFiltersLabel}
              >
                <FilterIcon className="size-6" />
              </button>
            </Reveal>

            <div className="flex flex-col gap-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <Reveal key={job.id} direction="up" delay={index * 0.03}>
                    <CareersJobCard
                      job={job}
                      variant="listing"
                      onViewJob={() => goToDetail(job.id)}
                    />
                  </Reveal>
                ))
              ) : (
                <p className="font-gill text-base font-light leading-110 text-neutral500">
                  No roles match your search. Try a different keyword.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CareersJobFiltersDrawer open={filtersOpen} onOpenChange={setFiltersOpen} />
    </section>
  );
};

export default CareersJobListingsSection;
