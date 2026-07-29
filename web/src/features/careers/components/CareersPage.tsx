"use client";

import { CareersJobsProvider } from "@/features/careers/context/CareersJobsContext";
import CareersApplicationFormSection from "./CareersApplicationFormSection";
import CareersApplicationSuccessSection from "./CareersApplicationSuccessSection";
import CareersBenefitsSection from "./CareersBenefitsSection";
import CareersBespokeInspirationsSection from "./CareersBespokeInspirationsSection";
import CareersFaqSection from "./CareersFaqSection";
import CareersHeroSection from "./CareersHeroSection";
import CareersJobDetailSection from "./CareersJobDetailSection";
import CareersJobListingsSection from "./CareersJobListingsSection";
import CareersLifeSection from "./CareersLifeSection";
import CareersOpeningsSection from "./CareersOpeningsSection";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";

function CareersFlowContent() {
  const { flowStep } = useCareersJobs();

  if (flowStep === "detail") {
    return <CareersJobDetailSection />;
  }

  if (flowStep === "application") {
    return <CareersApplicationFormSection />;
  }

  if (flowStep === "success") {
    return <CareersApplicationSuccessSection />;
  }

  return (
    <>
      <CareersHeroSection />
      {flowStep === "landing" ? (
        <>
          <CareersOpeningsSection />
          <CareersLifeSection />
          <CareersBenefitsSection />
          <CareersBespokeInspirationsSection />
          <CareersFaqSection />
        </>
      ) : (
        <CareersJobListingsSection />
      )}
    </>
  );
}

const CareersPage = () => {
  return (
    <CareersJobsProvider>
      <CareersFlowContent />
    </CareersJobsProvider>
  );
};

export default CareersPage;
