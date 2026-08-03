"use client";

import { useState } from "react";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import type { CareerJobDetailLabels } from "@/services/careers/careersJobDetailLabels";
import type { CareerJob } from "@/features/careers/types";
import { getCareerJobPath } from "@/features/careers/constants/careersRoutes";
import CareersJobPageHeader from "./shared/CareersJobPageHeader";
import CareersApplyOptionsModal from "./shared/CareersApplyOptionsModal";
import { careersApplyButtonClassName } from "@/features/careers/constants/careersApplyButton";

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

function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

function JobDescriptionContent({ descriptionHtml }: { descriptionHtml: string }) {
  if (looksLikeHtml(descriptionHtml)) {
    return (
      <div
        className="flex flex-col gap-2 [&_p]:m-0"
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
    );
  }

  const paragraphs = descriptionHtml.split(/\n\n+/).filter(Boolean);

  return (
    <div className="flex flex-col gap-4 whitespace-pre-line">
      {paragraphs.map((paragraph, index) => (
        <p key={`description-paragraph-${index}`} className="m-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export type CareersJobDetailViewProps = {
  job: CareerJob;
  jobDetails: CareerJobDetailLabels;
  onApply?: (entry: "resume" | "manual" | "linkedin", resumeFile?: File) => void;
  shareUrl?: string;
};

const CareersJobDetailView = ({
  job,
  jobDetails,
  onApply,
  shareUrl,
}: CareersJobDetailViewProps) => {
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const handleShare = async () => {
    const url =
      shareUrl ??
      (typeof window !== "undefined"
        ? `${window.location.origin}${getCareerJobPath(job.slug)}`
        : getCareerJobPath(job.slug));

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: job.title, url });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User cancelled share or clipboard unavailable.
    }
  };

  const qualifications = job.qualifications;
  const responsibilitiesText = job.rolesAndResponsibilities;
  const descriptionHtml = job.descriptionHtml;
  const jobSummary = job.jobSummary ?? job.summary;
  const lookingFor = job.whatWeAreLookingFor ?? job.requirements.join(" ");
  const whyJoin = job.whyJoinUs;
  const summaryParagraphs = jobSummary.split(/\n\n+/).filter(Boolean);
  const applyLabel = job.applyLabel ?? jobDetails.applyLabel;

  const handleApplyClick = () => {
    setApplyModalOpen(true);
  };

  const hasStructuredDetail =
    Boolean(job.jobSummary) ||
    Boolean(job.rolesAndResponsibilities) ||
    Boolean(job.qualifications?.length) ||
    Boolean(job.whatWeAreLookingFor) ||
    Boolean(job.whyJoinUs) ||
    job.responsibilities.length > 0 ||
    job.requirements.length > 0;
  const showDescriptionOnly =
    Boolean(descriptionHtml) &&
    !hasStructuredDetail &&
    descriptionHtml !== jobSummary;

  return (
    <section
      id="job-details"
      aria-labelledby="careers-job-detail-title"
      className="bg-white pt-10 pb-100 max-w-[1040px] px-4 mx-auto"
    >
      <div className="flex w-full flex-col gap-10">
        <Reveal direction="up">
          <CareersJobPageHeader
            job={job}
            titleId="careers-job-detail-title"
            shareLabel={jobDetails.shareLabel}
            onShare={handleShare}
          />
        </Reveal>

        <div className="flex flex-col gap-6">
          {showDescriptionOnly ? (
            <Reveal direction="up">
              <DetailSection heading={jobDetails.jobSummaryHeading}>
                <JobDescriptionContent descriptionHtml={descriptionHtml!} />
              </DetailSection>
            </Reveal>
          ) : (
            <>
              <Reveal direction="up">
                <DetailSection heading={jobDetails.jobSummaryHeading}>
                  <div className="flex flex-col gap-2">
                    {summaryParagraphs.map((paragraph, index) => (
                      <p key={`summary-paragraph-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                </DetailSection>
              </Reveal>

              {responsibilitiesText || job.responsibilities.length > 0 ? (
                <Reveal direction="up">
                  <DetailSection heading={jobDetails.rolesHeading}>
                    {responsibilitiesText ? (
                      <p>{responsibilitiesText}</p>
                    ) : (
                      <ul className={detailListClass}>
                        {job.responsibilities.map((item, index) => (
                          <li key={`responsibility-${index}`}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </DetailSection>
                </Reveal>
              ) : null}

              {qualifications || job.requirements.length > 0 ? (
                <Reveal direction="up">
                  <DetailSection heading={jobDetails.qualificationsHeading}>
                    {qualifications ? (
                      <div className="flex flex-col gap-4">
                        {qualifications.map((group, index) => (
                          <div key={`qualification-${index}-${group.label}`} className="flex flex-col gap-3">
                            <p>{group.label}</p>
                            <ul className={detailListClass}>
                              {group.text.split(/\n+/).filter(Boolean).map((item, itemIndex) => (
                                <li key={`qualification-item-${index}-${itemIndex}`}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className={detailListClass}>
                        {job.requirements.map((item, index) => (
                          <li key={`requirement-${index}`}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </DetailSection>
                </Reveal>
              ) : null}

              {job.whatWeAreLookingFor || job.requirements.length > 0 ? (
                <Reveal direction="up">
                  <DetailSection heading={jobDetails.lookingForHeading}>
                    {job.requirements.length > 1 ? (
                      <ul className={detailListClass}>
                        {job.requirements.map((item, index) => (
                          <li key={`requirement-${index}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{lookingFor}</p>
                    )}
                  </DetailSection>
                </Reveal>
              ) : null}

              {whyJoin ? (
                <Reveal direction="up">
                  <DetailSection heading={jobDetails.whyJoinHeading}>
                    <div className="flex flex-col gap-2">
                      {whyJoin.split(/\n\n+/).filter(Boolean).map((paragraph, index) => (
                        <p key={`why-join-paragraph-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  </DetailSection>
                </Reveal>
              ) : null}
            </>
          )}
        </div>

        <Reveal direction="up" className="flex w-full justify-start">
          <button
            type="button"
            onClick={handleApplyClick}
            className={careersApplyButtonClassName}
          >
            {applyLabel}
          </button>
        </Reveal>
      </div>

      <CareersApplyOptionsModal
        job={job}
        applyModal={jobDetails.applyModal}
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        onAutofillResume={(file) => onApply?.("resume", file)}
        onApplyManually={() => onApply?.("manual")}
        onApplyLinkedIn={() => onApply?.("linkedin")}
      />
    </section>
  );
};

export default CareersJobDetailView;
