"use client";

import Reveal from "@/shared/Animation/Reveal";
import { careersPageContent, getRecentCareerJobs } from "@/features/careers/data/content";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersJobCard from "./shared/CareersJobCard";
import CareersSectionCta from "./shared/CareersSectionCta";

const CareersOpeningsSection = () => {
  const { openings } = careersPageContent;
  const recentJobs = getRecentCareerJobs(3);
  const { goToDetail, goToListings } = useCareersJobs();

  return (
    <section
      id="open-roles"
      aria-labelledby="careers-openings-title"
      className="bg-white px-4 py-10 md:px-100 md:pb-104 md:pt-16"
    >
      <div className="flex w-full flex-col gap-10 md:items-center">
        <div className="flex flex-col gap-3 text-left md:gap-4 md:w-full md:items-center md:text-center">
          <Reveal
            as="h2"
            id="careers-openings-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
          >
            {openings.mobileTitle}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-base font-light leading-110 text-neutral500 md:text-xl"
          >
            {openings.subtitle}
          </Reveal>
        </div>

        <div className="flex w-full flex-col gap-4 md:gap-4">
          {recentJobs.map((job) => (
            <Reveal key={job.id} direction="up">
              <CareersJobCard
                job={job}
                variant="landing"
                onViewJob={() => goToDetail(job.id)}
              />
            </Reveal>
          ))}
        </div>

        <Reveal direction="up">
          <CareersSectionCta variant="link" onClick={goToListings}>
            {openings.viewAllLabel}
          </CareersSectionCta>
        </Reveal>
      </div>
    </section>
  );
};

export default CareersOpeningsSection;
