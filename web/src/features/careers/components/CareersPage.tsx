"use client";

import { CareersJobsProvider } from "../context/CareersJobsContext";
import CareersApplicationFormSection from "./CareersApplicationFormSection";
import CareersBenefitsSection from "./CareersBenefitsSection";
import CareersBespokeInspirationsSection from "./CareersBespokeInspirationsSection";
import CareersFaqSection from "./CareersFaqSection";
import CareersHeroSection from "./CareersHeroSection";
import CareersJobDetailsSection from "./CareersJobDetailsSection";
import CareersJobListingSection from "./CareersJobListingSection";
import CareersLifeSection from "./CareersLifeSection";
import CareersRecentOpeningsSection from "./CareersRecentOpeningsSection";

const CareersPage = () => {
  return (
    <CareersJobsProvider>
      <CareersHeroSection />
      <CareersRecentOpeningsSection />
      <CareersJobListingSection />
      <CareersJobDetailsSection />
      <CareersApplicationFormSection />
      <CareersLifeSection />
      <CareersBenefitsSection />
      <CareersBespokeInspirationsSection />
      <CareersFaqSection />
    </CareersJobsProvider>
  );
};

export default CareersPage;
