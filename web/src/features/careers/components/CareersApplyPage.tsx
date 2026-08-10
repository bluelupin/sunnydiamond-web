"use client";

import { useLayoutEffect, useMemo } from "react";
import type { NormalizedCareerJob, NormalizedCareersPageData } from "@/services/careers/careers.types";
import { CareersJobsProvider, useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import { mergeCareerJobIntoCms } from "@/features/careers/utils/careersJobs";
import { resetCareersHeaderMode, setCareersHeaderMode } from "@/features/careers/context/careersHeaderBridge";
import CareersApplicationFormSection from "./CareersApplicationFormSection";
import CareersApplicationSuccessSection from "./CareersApplicationSuccessSection";

function CareersApplyFlowContent() {
  const { flowStep } = useCareersJobs();

  if (flowStep === "success") {
    return <CareersApplicationSuccessSection />;
  }

  return <CareersApplicationFormSection />;
}

type CareersApplyPageProps = {
  cms: NormalizedCareersPageData;
  job: NormalizedCareerJob;
};

const CareersApplyPage = ({ cms, job }: CareersApplyPageProps) => {
  const cmsWithJob = useMemo(() => mergeCareerJobIntoCms(cms, job), [cms, job]);

  useLayoutEffect(() => {
    setCareersHeaderMode("solid");
    return () => resetCareersHeaderMode();
  }, []);

  return (
    <CareersJobsProvider cms={cmsWithJob} initialSelectedJobId={job.id} initialFlowStep="application">
      <CareersApplyFlowContent />
    </CareersJobsProvider>
  );
};

export default CareersApplyPage;
