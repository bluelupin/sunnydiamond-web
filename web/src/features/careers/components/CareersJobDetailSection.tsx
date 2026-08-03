"use client";

import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import { resolveCareerJobDetailLabels } from "@/services/careers/careersJobDetailLabels";
import CareersJobDetailView from "./CareersJobDetailView";

const CareersJobDetailSection = () => {
  const { selectedJob, goToApplication, cms } = useCareersJobs();

  if (!selectedJob) {
    return null;
  }

  const jobDetails = resolveCareerJobDetailLabels(cms.landing.applicationFlow?.jobDetails);
  const canApply = Boolean(cms.landing.applicationFlow);

  return (
    <CareersJobDetailView
      job={selectedJob}
      jobDetails={jobDetails}
      onApply={
        canApply ? (entry, resumeFile) => goToApplication(entry, resumeFile) : undefined
      }
    />
  );
};

export default CareersJobDetailSection;
