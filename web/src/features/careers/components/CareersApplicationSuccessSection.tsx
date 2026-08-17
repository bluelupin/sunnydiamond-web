"use client";

import Link from "next/link";
import Reveal from "@/shared/Animation/Reveal";
import { resolveCareerApplicationFlow } from "@/services/careers/resolveCareerApplicationFlow";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersApplicationSuccessIcon from "./shared/CareersApplicationSuccessIcon";
import CareersSuccessJobIdCopy from "./shared/CareersSuccessJobIdCopy";

const CareersApplicationSuccessSection = () => {
  const { selectedJob, cms } = useCareersJobs();
  const applicationSuccess = resolveCareerApplicationFlow(cms.landing.applicationFlow).applicationSuccess;

  return (
    <section
      aria-labelledby="careers-success-title"
      className="bg-white md:px-0 px-4 md:py-[88px] sm:py-16 py-10 max-w-[560px] mx-auto"
    >
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <Reveal direction="up" className="flex flex-col items-center gap-6">
          <CareersApplicationSuccessIcon />
          <h1
            id="careers-success-title"
            className="font-larken md:text-32 text-xl font-light leading-110 text-darkblack"
          >
            {applicationSuccess.title}
          </h1>
          <div className="flex w-full flex-col gap-4">
            <p className="font-gill md:text-base text-sm leading-110 text-darkblack">{applicationSuccess.descriptionLine1}</p>
            <p className="font-gill md:text-base text-sm leading-110 text-darkblack">{applicationSuccess.descriptionLine2}</p>
          </div>
        </Reveal>

        {selectedJob ? (
          <Reveal direction="up" className="flex w-full flex-col gap-4 bg-gray300 p-6 text-left">
            <h2 className="font-larken md:text-xl text-base font-light leading-110 text-darkblack">
              {applicationSuccess.appliedJobDetailsHeading} 
            </h2>
            <div className="h-px w-full bg-neutral300" aria-hidden />
            <p className="font-gill md:text-base text-sm leading-110 text-darkblack flex items-center justify-between gap-2 w-full">
              <span className="font-light">{applicationSuccess.jobTitleLabel} </span>
              <span className="font-normal">{selectedJob.title}</span>
            </p>
            <CareersSuccessJobIdCopy
              jobCode={selectedJob.jobCode}
              label={applicationSuccess.jobIdLabel}
            />
          </Reveal>
        ) : null}

        <Reveal direction="up">
          <Link
            href="/"
            className="inline-flex flex-col items-center border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            {applicationSuccess.goHomeLabel}
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default CareersApplicationSuccessSection;
