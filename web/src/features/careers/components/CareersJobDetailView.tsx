"use client";

import { useState } from "react";
import Reveal from "@/shared/Animation/Reveal";
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

        {job.descriptionHtml ? (
          <Reveal direction="up">
            <div className="bg-gray300 p-4 md:p-6">
              <div
                className="editor-content"
                dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
              />
            </div>
          </Reveal>
        ) : null}

        <Reveal direction="up" className="flex w-full justify-start">
          <button
            type="button"
            onClick={() => setApplyModalOpen(true)}
            className="inline-flex h-14 w-fit sm:min-w-[183px] min-w-full items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
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
