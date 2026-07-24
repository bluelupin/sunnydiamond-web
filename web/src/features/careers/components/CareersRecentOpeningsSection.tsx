"use client";

import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import { careersPageContent, getRecentCareerJobs } from "../data/content";
import { useCareersJobs } from "../context/CareersJobsContext";
import type { CareerJob } from "../types";

function formatPostedDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function RecentOpeningCard({
  job,
  isSelected,
  onSelect,
}: {
  job: CareerJob;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        "flex w-[300px] shrink-0 snap-start flex-col gap-4 border bg-white p-6 text-left transition-colors md:w-full",
        isSelected ? "border-darkblack" : "border-neutral300 hover:border-darkblack/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-larken text-xl font-light leading-110 text-darkblack md:text-2xl">
          {job.title}
        </h3>
        {job.isNew ? (
          <span className="shrink-0 bg-darkblack px-2 py-1 font-gill text-xs font-normal uppercase leading-110 text-white">
            New
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 font-gill text-sm font-light leading-110 text-neutral500">
        <span>{job.department}</span>
        <span>{job.location}</span>
        <span>{job.type}</span>
      </div>
      <p className="line-clamp-2 font-gill text-sm font-light leading-110 text-neutral500">
        {job.summary}
      </p>
      <span className="font-gill text-xs font-normal uppercase leading-110 text-neutral500">
        Posted {formatPostedDate(job.postedAt)}
      </span>
    </button>
  );
}

const CareersRecentOpeningsSection = () => {
  const { recentOpenings } = careersPageContent;
  const recentJobs = getRecentCareerJobs(3);
  const { selectedJobId, selectJob } = useCareersJobs();

  const handleSelect = (jobId: string) => {
    selectJob(jobId);
    document.getElementById("job-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="recent-openings"
      aria-labelledby="careers-recent-openings-title"
      className="bg-white px-4 py-16 md:px-10 md:py-100"
    >
      <div className="mx-auto flex w-full max-w-1360 flex-col gap-10">
        <div className="flex max-w-[640px] flex-col gap-4">
          <Reveal
            as="h2"
            id="careers-recent-openings-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
          >
            {recentOpenings.title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl"
          >
            {recentOpenings.description}
          </Reveal>
        </div>

        <div className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:snap-none">
          {recentJobs.map((job) => (
            <Reveal key={job.id} direction="up" className="contents">
              <RecentOpeningCard
                job={job}
                isSelected={selectedJobId === job.id}
                onSelect={() => handleSelect(job.id)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareersRecentOpeningsSection;
