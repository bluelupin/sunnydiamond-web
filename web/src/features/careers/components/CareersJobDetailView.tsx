"use client";

import { useState } from "react";
import Reveal from "@/shared/Animation/Reveal";
import { careersDarkCtaClassName } from "@/features/careers/constants/careersCtaStyles";
import { cn } from "@/shared/utils/cn";
import "@/shared/styles/editor-content.css";
import type { CareerJobDetailLabels } from "@/services/careers/careersJobDetailLabels";
import type { CareerJob } from "@/features/careers/types";
import { getCareerJobPath } from "@/features/careers/constants/careersRoutes";
import CareersJobPageHeader from "./shared/CareersJobPageHeader";
import CareersApplyOptionsModal from "./shared/CareersApplyOptionsModal";

export type CareersJobDetailViewProps = {
  job: CareerJob;
  jobDetails: CareerJobDetailLabels;
  onApply?: (entry: "resume" | "manual" | "linkedin", resumeFile?: File) => void;
  shareUrl?: string;
};

type JobDetailContentSectionProps = {
  title: string;
  html: string;
};

const JobDetailContentSection = ({ title, html }: JobDetailContentSectionProps) => (
  <div className="bg-gray300 p-4 md:p-6 space-y-4">
    <div className="space-y-4">
      <h2 className="font-larken font-light leading-110 text-darkblack text-xl">
        {title}
      </h2>
      <div className="h-px w-full bg-neutral300" aria-hidden />
    </div>
    <div className="editor-content" dangerouslySetInnerHTML={{ __html: html }} />
  </div>
);

const CareersJobDetailView = ({
  job,
  jobDetails,
  onApply,
  shareUrl,
}: CareersJobDetailViewProps) => {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const applyLabel = job.applyLabel || jobDetails.applyLabel;

  const handleShare = async () => {
    const url =
      shareUrl ??
      (typeof window !== "undefined"
        ? `${window.location.origin}${getCareerJobPath(job.jobCode)}`
        : getCareerJobPath(job.jobCode));

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

  const hasStructuredContent = [
    job.jobSummary,
    job.rolesAndResponsibilities,
    job.skills,
    job.whatWeAreLookingFor,
    job.whyJoinUs,
    job.additionalInfo,
    ...(job.qualifications?.map((group) => group.text) ?? []),
  ].some(Boolean);

  const contentSections = [
    job.jobSummary
      ? {
        key: "job-summary",
        title: job.jobSummaryTitle ?? jobDetails.jobSummaryHeading,
        html: job.jobSummary,
      }
      : null,
    job.rolesAndResponsibilities
      ? {
        key: "roles",
        title: job.rolesTitle ?? jobDetails.rolesHeading,
        html: job.rolesAndResponsibilities,
      }
      : null,
    job.qualifications && job.qualifications.length > 0
      ? {
        key: "qualifications",
        title: job.qualificationsTitle ?? jobDetails.qualificationsHeading,
        html: job.qualifications
          .map((group) => `<h3>${group.label}</h3>${group.text}`)
          .join(""),
      }
      : null,
    job.skills
      ? {
        key: "skills",
        title: job.skillsTitle ?? jobDetails.skillsHeading,
        html: job.skills,
      }
      : null,
    job.whatWeAreLookingFor
      ? {
        key: "looking-for",
        title: job.whatWeAreLookingForTitle ?? jobDetails.lookingForHeading,
        html: job.whatWeAreLookingFor,
      }
      : null,
    job.whyJoinUs
      ? {
        key: "why-join",
        title: job.whyJoinUsTitle ?? jobDetails.whyJoinHeading,
        html: job.whyJoinUs,
      }
      : null,
    job.additionalInfo
      ? {
        key: "additional-info",
        title: job.additionalInfoTitle ?? jobDetails.additionalInfoHeading,
        html: job.additionalInfo,
      }
      : null,
    !hasStructuredContent && job.descriptionHtml
      ? {
        key: "legacy-description",
        title: jobDetails.jobSummaryHeading,
        html: job.descriptionHtml,
      }
      : null,
  ].filter(Boolean) as Array<{ key: string; title: string; html: string }>;

  return (
    <section
      id="job-details"
      aria-labelledby="careers-job-detail-title"
      className="bg-white md:pt-10 pt-6 md:pb-100 pb-16 max-w-[1040px] px-4 mx-auto"
    >
      <div className="flex w-full flex-col md:gap-10 gap-6">
        <Reveal direction="up">
          <CareersJobPageHeader
            job={job}
            titleId="careers-job-detail-title"
            shareLabel={jobDetails.shareLabel}
            onShare={handleShare}
          />
        </Reveal>

        {contentSections.length > 0 ? (
          <div className="flex flex-col gap-6">
            {contentSections.map((section) => (
              <Reveal key={section.key} direction="up">
                <JobDetailContentSection title={section.title} html={section.html} />
              </Reveal>
            ))}
          </div>
        ) : null}

        <Reveal direction="up" className="flex w-full justify-start">
          <button
            type="button"
            onClick={() => setApplyModalOpen(true)}
            className={cn(careersDarkCtaClassName, "w-fit min-w-full sm:min-w-[183px]")}
          >
            <span className="relative z-10">{applyLabel}</span>
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
