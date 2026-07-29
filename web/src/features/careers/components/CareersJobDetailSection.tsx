"use client";

import { useState } from "react";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import { careersPageContent } from "@/features/careers/data/content";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersJobPageHeader from "./shared/CareersJobPageHeader";
import CareersApplyOptionsModal from "./shared/CareersApplyOptionsModal";

const detailListClass =
  "m-0 flex list-disc flex-col gap-2 pl-[21px] font-gill text-sm font-normal leading-110 text-darkblack md:pl-[30px] md:text-xl";

function DetailSection({
  heading,
  children,
  className,
}: {
  heading: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 bg-gray300 p-4 md:p-6", className)}>
      <h3 className="font-larken text-xl font-light leading-110 text-darkblack">{heading}</h3>
      <span className="h-px w-full bg-neutral300" aria-hidden />
      <div className="w-full font-gill text-sm font-normal leading-110 text-darkblack md:text-xl">
        {children}
      </div>
    </div>
  );
}

const CareersJobDetailSection = () => {
  const { jobDetails } = careersPageContent;
  const { selectedJob, goToApplication } = useCareersJobs();
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  if (!selectedJob) {
    return null;
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/careers`;
    try {
      if (navigator.share) {
        await navigator.share({ title: selectedJob.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      // User cancelled share or clipboard unavailable.
    }
  };

  const qualifications = selectedJob.qualifications;
  const responsibilitiesText = selectedJob.rolesAndResponsibilities;
  const jobSummary = selectedJob.jobSummary ?? selectedJob.summary;
  const lookingFor = selectedJob.whatWeAreLookingFor ?? selectedJob.requirements.join(" ");
  const whyJoin = selectedJob.whyJoinUs;
  const summaryParagraphs = jobSummary.split(/\n\n+/).filter(Boolean);

  return (
    <section
      id="job-details"
      aria-labelledby="careers-job-detail-title"
      className="bg-white px-4 pb-10 pt-[calc(4.5rem+env(safe-area-inset-top,0px)+2.5rem)] md:px-200 md:landscape:pb-104 md:landscape:pt-[144px]"
    >
      <div className="flex w-full flex-col gap-10">
        <Reveal direction="up">
          <CareersJobPageHeader
            job={selectedJob}
            titleId="careers-job-detail-title"
            shareLabel={jobDetails.shareLabel}
            onShare={handleShare}
          />
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal direction="up">
            <DetailSection heading={jobDetails.jobSummaryHeading}>
              <div className="flex flex-col gap-2">
                {summaryParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </DetailSection>
          </Reveal>

          <Reveal direction="up">
            <DetailSection heading={jobDetails.rolesHeading}>
              {responsibilitiesText ? (
                <p>{responsibilitiesText}</p>
              ) : (
                <ul className={detailListClass}>
                  {selectedJob.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </DetailSection>
          </Reveal>

          <Reveal direction="up">
            <DetailSection heading={jobDetails.qualificationsHeading}>
              {qualifications ? (
                <div className="flex flex-col gap-4">
                  {qualifications.map((group) => (
                    <div key={group.label} className="flex flex-col gap-3">
                      <p>{group.label}</p>
                      <ul className={detailListClass}>
                        {group.text.split(/\n+/).filter(Boolean).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className={detailListClass}>
                  {selectedJob.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </DetailSection>
          </Reveal>

          <Reveal direction="up">
            <DetailSection heading={jobDetails.lookingForHeading}>
              {selectedJob.requirements.length > 1 ? (
                <ul className={detailListClass}>
                  {selectedJob.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{lookingFor}</p>
              )}
            </DetailSection>
          </Reveal>

          {whyJoin ? (
            <Reveal direction="up">
              <DetailSection heading={jobDetails.whyJoinHeading}>
                <div className="flex flex-col gap-2">
                  {whyJoin.split(/\n\n+/).filter(Boolean).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </DetailSection>
            </Reveal>
          ) : null}
        </div>

        <Reveal direction="up">
          <button
            type="button"
            onClick={() => setApplyModalOpen(true)}
            className="inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 md:w-[183px]"
          >
            {jobDetails.applyLabel}
          </button>
        </Reveal>
      </div>

      <CareersApplyOptionsModal
        job={selectedJob}
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        onAutofillResume={(file) => goToApplication("resume", file)}
        onApplyManually={() => goToApplication("manual")}
        onApplyLinkedIn={() => goToApplication("linkedin")}
      />
    </section>
  );
};

export default CareersJobDetailSection;
