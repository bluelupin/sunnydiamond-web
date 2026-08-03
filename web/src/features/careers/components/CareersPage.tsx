"use client";

import { CareersJobsProvider } from "@/features/careers/context/CareersJobsContext";
import type { NormalizedCareersPageData } from "@/services/careers/careers.types";
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
  const { flowStep, cms } = useCareersJobs();
  const { landing, listing } = cms;

  if (flowStep === "detail") {
    return <CareersJobDetailSection />;
  }

  if (flowStep === "application") {
    return landing.applicationFlow ? <CareersApplicationFormSection /> : null;
  }

  if (flowStep === "success") {
    return landing.applicationFlow ? <CareersApplicationSuccessSection /> : null;
  }

  const hero = flowStep === "listings" ? (listing.hero ?? landing.hero) : landing.hero;

  return (
    <>
      {hero ? <CareersHeroSection hero={hero} /> : null}
      {flowStep === "landing" ? (
        <>
          {landing.openings ? <CareersOpeningsSection openings={landing.openings} /> : null}
          {landing.lifeAt ? <CareersLifeSection lifeAt={landing.lifeAt} /> : null}
          {landing.benefits ? <CareersBenefitsSection benefits={landing.benefits} /> : null}
          {landing.discover ? <CareersBespokeInspirationsSection discover={landing.discover} /> : null}
          {landing.faq ? <CareersFaqSection faq={landing.faq} /> : null}
        </>
      ) : (
        <CareersJobListingsSection />
      )}
    </>
  );
}

type CareersPageProps = {
  cms: NormalizedCareersPageData;
};

const CareersPage = ({ cms }: CareersPageProps) => {
  return (
    <CareersJobsProvider cms={cms}>
      <CareersFlowContent />
    </CareersJobsProvider>
  );
};

export default CareersPage;
