"use client";

import { useLayoutEffect, useMemo } from "react";
import type { NormalizedCareerJob, NormalizedCareersPageData } from "@/services/careers/careers.types";
import { resolveCareerJobDetailLabels } from "@/services/careers/careersJobDetailLabels";
import { getCareerJobPath } from "@/features/careers/constants/careersRoutes";
import { CareersJobsProvider, useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import { resetCareersHeaderMode, setCareersHeaderMode } from "@/features/careers/context/careersHeaderBridge";
import CareersApplicationFormSection from "./CareersApplicationFormSection";
import CareersApplicationSuccessSection from "./CareersApplicationSuccessSection";
import CareersJobDetailView from "./CareersJobDetailView";

function mergeJobIntoCms(cms: NormalizedCareersPageData, job: NormalizedCareerJob): NormalizedCareersPageData {
  const hasJob = cms.jobs.some((entry) => entry.id === job.id || entry.slug === job.slug);

  if (hasJob) {
    return cms;
  }

  return {
    ...cms,
    jobs: [...cms.jobs, job],
  };
}

function CareersJobSlugFlowContent({ job }: { job: NormalizedCareerJob }) {
  const { flowStep, goToApplication, cms } = useCareersJobs();
  const jobDetails = resolveCareerJobDetailLabels(cms.landing.applicationFlow?.jobDetails);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${getCareerJobPath(job.slug)}`
      : undefined;

  if (flowStep === "application" && cms.landing.applicationFlow) {
    return <CareersApplicationFormSection />;
  }

  if (flowStep === "success" && cms.landing.applicationFlow) {
    return <CareersApplicationSuccessSection />;
  }

  const canApply = Boolean(cms.landing.applicationFlow);

  return (
    <CareersJobDetailView
      job={job}
      jobDetails={jobDetails}
      shareUrl={shareUrl}
      onApply={
        canApply
          ? (entry, resumeFile) => goToApplication(entry, resumeFile)
          : undefined
      }
    />
  );
}

type CareersJobSlugPageProps = {
  cms: NormalizedCareersPageData;
  job: NormalizedCareerJob;
};

const CareersJobSlugPage = ({ cms, job }: CareersJobSlugPageProps) => {
  const cmsWithJob = useMemo(() => mergeJobIntoCms(cms, job), [cms, job]);

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
