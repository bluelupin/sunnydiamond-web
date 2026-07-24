"use client";

import Reveal from "@/shared/Animation/Reveal";
import { careersPageContent } from "../data/content";
import { useCareersJobs } from "../context/CareersJobsContext";

const CareersJobDetailsSection = () => {
  const { jobDetails } = careersPageContent;
  const { selectedJob } = useCareersJobs();

  return (
    <section
      id="job-details"
      aria-labelledby="careers-job-details-title"
      className="bg-white px-4 py-16 md:px-10 md:py-100"
    >
      <div className="mx-auto flex w-full max-w-1360 flex-col gap-10">
        <Reveal
          as="h2"
          id="careers-job-details-title"
          direction="up"
          className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
        >
          {jobDetails.title}
        </Reveal>

        {selectedJob ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
            <div className="flex flex-col gap-8">
              <Reveal direction="up" className="flex flex-col gap-3">
                <h3 className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32">
                  {selectedJob.title}
                </h3>
                <p className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg">
                  {selectedJob.summary}
                </p>
              </Reveal>

              <Reveal direction="up" className="flex flex-col gap-4">
                <h4 className="font-gill text-base font-normal uppercase leading-110 text-darkblack md:text-lg">
                  {jobDetails.responsibilitiesHeading}
                </h4>
                <ul className="m-0 flex list-disc flex-col gap-3 pl-5">
                  {selectedJob.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="font-gill text-sm font-light leading-110 text-neutral500 md:text-base"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal direction="up" className="flex flex-col gap-4">
                <h4 className="font-gill text-base font-normal uppercase leading-110 text-darkblack md:text-lg">
                  {jobDetails.requirementsHeading}
                </h4>
                <ul className="m-0 flex list-disc flex-col gap-3 pl-5">
                  {selectedJob.requirements.map((item) => (
                    <li
                      key={item}
                      className="font-gill text-sm font-light leading-110 text-neutral500 md:text-base"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal direction="up" className="h-fit border border-neutral300 bg-gray200 p-6">
              <dl className="m-0 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <dt className="font-gill text-xs font-normal uppercase leading-110 text-neutral500">
                    Department
                  </dt>
                  <dd className="font-gill text-base font-light leading-110 text-darkblack">
                    {selectedJob.department}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="font-gill text-xs font-normal uppercase leading-110 text-neutral500">
                    Location
                  </dt>
                  <dd className="font-gill text-base font-light leading-110 text-darkblack">
                    {selectedJob.location}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="font-gill text-xs font-normal uppercase leading-110 text-neutral500">
                    Employment Type
                  </dt>
                  <dd className="font-gill text-base font-light leading-110 text-darkblack">
                    {selectedJob.type}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        ) : (
          <Reveal direction="up">
            <p className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg">
              {jobDetails.emptyState}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default CareersJobDetailsSection;
