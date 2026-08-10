"use client";

import { CareersJobsProvider } from "@/features/careers/context/CareersJobsContext";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import type { NormalizedCareersPageData } from "@/services/careers/careers.types";
import CareersHeroSection from "./CareersHeroSection";
import CareersJobListingsSection from "./CareersJobListingsSection";

function CareersAllOpeningsContent() {
  const { cms } = useCareersJobs();
  const hero = cms.landing.hero ?? cms.listing.hero;

  return (
    <>
      {hero ? <CareersHeroSection hero={hero} /> : null}
      <CareersJobListingsSection />
    </>
  );
}

type CareersAllOpeningsPageProps = {
  cms: NormalizedCareersPageData;
};

const CareersAllOpeningsPage = ({ cms }: CareersAllOpeningsPageProps) => {
  return (
    <CareersJobsProvider cms={cms} initialFlowStep="listings">
      <CareersAllOpeningsContent />
    </CareersJobsProvider>
  );
};

export default CareersAllOpeningsPage;
