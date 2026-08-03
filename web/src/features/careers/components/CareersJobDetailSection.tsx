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

  return (
    <CareersJobDetailView
      job={selectedJob}
      jobDetails={jobDetails}
      onApply={(entry, resumeFile) => goToApplication(entry, resumeFile)}
    />
  );
};

export default CareersJobDetailSection;
