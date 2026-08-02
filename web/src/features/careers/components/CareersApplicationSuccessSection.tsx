"use client";

import Link from "next/link";
import Reveal from "@/shared/Animation/Reveal";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersApplicationSuccessIcon from "./shared/CareersApplicationSuccessIcon";
import CareersSuccessJobIdCopy from "./shared/CareersSuccessJobIdCopy";

const CareersApplicationSuccessSection = () => {
  const { selectedJob, cms } = useCareersJobs();
  const applicationSuccess = cms.landing.applicationFlow?.applicationSuccess;

  if (!applicationSuccess) {
    return null;
  }

  return (
    <section
      aria-labelledby="careers-success-title"
      className="bg-white px-4 pb-10 pt-[calc(4.5rem+env(safe-area-inset-top,0px)+2.5rem)] md:px-100 md:landscape:pb-104 md:landscape:pt-[144px]"
    >
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-6 text-center">
        <Reveal direction="up" className="flex flex-col items-center gap-6">
          <CareersApplicationSuccessIcon />
          <h1
            id="careers-success-title"
            className="font-larken text-32 font-light leading-110 text-darkblack"
          >
            {applicationSuccess.title}
          </h1>
          <div className="flex w-full flex-col gap-4 font-gill text-base leading-110 text-darkblack">
            <p>{applicationSuccess.descriptionLine1}</p>
            <p>{applicationSuccess.descriptionLine2}</p>
          </div>
        </Reveal>

        {selectedJob ? (
          <Reveal direction="up" className="flex w-full flex-col gap-4 bg-gray300 p-6 text-left">
            <h2 className="font-larken text-xl font-light leading-110 text-darkblack">
              {applicationSuccess.appliedJobDetailsHeading}
            </h2>
            <div className="h-px w-full bg-neutral300" aria-hidden />
            <p className="font-gill text-base leading-110 text-darkblack">
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
