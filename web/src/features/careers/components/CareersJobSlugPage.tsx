"use client";

import { useLayoutEffect, useMemo } from "react";
import type { NormalizedCareerJob, NormalizedCareersPageData } from "@/services/careers/careers.types";
import { resolveCareerJobDetailLabels } from "@/services/careers/careersJobDetailLabels";
import { getCareerJobPath } from "@/features/careers/constants/careersRoutes";
import { CareersJobsProvider, useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import { mergeCareerJobIntoCms } from "@/features/careers/utils/careersJobs";
import { resetCareersHeaderMode, setCareersHeaderMode } from "@/features/careers/context/careersHeaderBridge";
import CareersApplicationFormSection from "./CareersApplicationFormSection";
import CareersApplicationSuccessSection from "./CareersApplicationSuccessSection";
import CareersJobDetailView from "./CareersJobDetailView";

function CareersJobSlugFlowContent({ job }: { job: NormalizedCareerJob }) {
  const { flowStep, goToApplication, cms } = useCareersJobs();
  const jobDetails = resolveCareerJobDetailLabels(cms.landing.applicationFlow?.jobDetails);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${getCareerJobPath(job.jobCode)}`
      : undefined;

  if (flowStep === "application") {
    return <CareersApplicationFormSection />;
  }

  if (flowStep === "success") {
    return <CareersApplicationSuccessSection />;
  }

  return (
    <CareersJobDetailView
      job={job}
      jobDetails={jobDetails}
      shareUrl={shareUrl}
      onApply={(entry, resumeFile) => goToApplication(entry, resumeFile, job.jobCode)}
    />
  );
}

type CareersJobSlugPageProps = {
  cms: NormalizedCareersPageData;
  job: NormalizedCareerJob;
};

const CareersJobSlugPage = ({ cms, job }: CareersJobSlugPageProps) => {
  const cmsWithJob = useMemo(() => mergeCareerJobIntoCms(cms, job), [cms, job]);

  useLayoutEffect(() => {
    setCareersHeaderMode("solid");
    return () => resetCareersHeaderMode();
  }, []);

  return (
    <CareersJobsProvider cms={cmsWithJob} initialSelectedJobId={job.id} initialFlowStep="detail">
      <CareersJobSlugFlowContent job={job} />
    </CareersJobsProvider>
  );
};

export default CareersJobSlugPage;
