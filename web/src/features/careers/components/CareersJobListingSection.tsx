"use client";

import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import { careersPageContent } from "../data/content";
import { useCareersJobs } from "../context/CareersJobsContext";

const CareersJobListingSection = () => {
  const { jobListing } = careersPageContent;
  const { jobs, selectedJobId, selectJob } = useCareersJobs();

  const handleSelect = (jobId: string) => {
    selectJob(jobId);
    document.getElementById("job-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="job-listing"
      aria-labelledby="careers-job-listing-title"
      className="bg-gray200 px-4 py-16 md:px-10 md:py-100"
    >
      <div className="mx-auto flex w-full max-w-1360 flex-col gap-10">
        <div className="flex max-w-[640px] flex-col gap-4">
          <Reveal
            as="h2"
            id="careers-job-listing-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
          >
            {jobListing.title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl"
          >
            {jobListing.description}
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          {jobs.map((job, index) => {
            const isSelected = selectedJobId === job.id;

            return (
              <Reveal key={job.id} direction="up" delay={index * 0.05}>
                <button
                  type="button"
                  onClick={() => handleSelect(job.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex w-full flex-col gap-3 border bg-white p-5 text-left transition-colors md:flex-row md:items-center md:justify-between md:gap-6 md:p-6",
                    isSelected ? "border-darkblack" : "border-transparent hover:border-darkblack/20",
                  )}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-larken text-xl font-light leading-110 text-darkblack md:text-2xl">
                        {job.title}
                      </h3>
                      {job.isNew ? (
                        <span className="bg-darkblack px-2 py-1 font-gill text-xs font-normal uppercase leading-110 text-white">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="line-clamp-2 font-gill text-sm font-light leading-110 text-neutral500 md:text-base">
                      {job.summary}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-1 font-gill text-sm font-light leading-110 text-neutral500 md:text-right">
                    <span>{job.department}</span>
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CareersJobListingSection;
