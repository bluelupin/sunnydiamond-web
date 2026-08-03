import type { NormalizedCareerApplicationFlow } from "./careers.types";

export type CareerJobDetailLabels = NormalizedCareerApplicationFlow["jobDetails"];

const JOB_DETAIL_LABEL_FALLBACKS: CareerJobDetailLabels = {
  applyLabel: "Apply Now",
  jobSummaryHeading: "Job Summary",
  rolesHeading: "Roles & Responsibilities",
  qualificationsHeading: "Qualifications",
  lookingForHeading: "What We're Looking For",
  whyJoinHeading: "Why Join Us",
  shareLabel: "Share",
  viewJobLabel: "View Job",
  applyModal: {
    title: "Start your Application",
    autofillResumeLabel: "Autofill with resume",
    applyManuallyLabel: "Apply manually",
    applyLinkedInLabel: "Apply with LinkedIn",
    closeLabel: "Close",
  },
};

/** CMS `applicationFlowSection` job-detail copy with safe defaults for the slug detail page. */
export function resolveCareerJobDetailLabels(
  jobDetails?: CareerJobDetailLabels | null,
): CareerJobDetailLabels {
  if (!jobDetails) {
    return JOB_DETAIL_LABEL_FALLBACKS;
  }

  return {
    applyLabel: jobDetails.applyLabel || JOB_DETAIL_LABEL_FALLBACKS.applyLabel,
    jobSummaryHeading:
      jobDetails.jobSummaryHeading || JOB_DETAIL_LABEL_FALLBACKS.jobSummaryHeading,
    rolesHeading: jobDetails.rolesHeading || JOB_DETAIL_LABEL_FALLBACKS.rolesHeading,
    qualificationsHeading:
      jobDetails.qualificationsHeading || JOB_DETAIL_LABEL_FALLBACKS.qualificationsHeading,
    lookingForHeading:
      jobDetails.lookingForHeading || JOB_DETAIL_LABEL_FALLBACKS.lookingForHeading,
    whyJoinHeading: jobDetails.whyJoinHeading || JOB_DETAIL_LABEL_FALLBACKS.whyJoinHeading,
    shareLabel: jobDetails.shareLabel || JOB_DETAIL_LABEL_FALLBACKS.shareLabel,
    viewJobLabel: jobDetails.viewJobLabel || JOB_DETAIL_LABEL_FALLBACKS.viewJobLabel,
    applyModal: {
      title: jobDetails.applyModal.title || JOB_DETAIL_LABEL_FALLBACKS.applyModal.title,
      autofillResumeLabel:
        jobDetails.applyModal.autofillResumeLabel ||
        JOB_DETAIL_LABEL_FALLBACKS.applyModal.autofillResumeLabel,
      applyManuallyLabel:
        jobDetails.applyModal.applyManuallyLabel ||
        JOB_DETAIL_LABEL_FALLBACKS.applyModal.applyManuallyLabel,
      applyLinkedInLabel:
        jobDetails.applyModal.applyLinkedInLabel ||
        JOB_DETAIL_LABEL_FALLBACKS.applyModal.applyLinkedInLabel,
      closeLabel:
        jobDetails.applyModal.closeLabel || JOB_DETAIL_LABEL_FALLBACKS.applyModal.closeLabel,
    },
  };
}
