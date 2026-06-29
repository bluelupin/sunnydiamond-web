import type { NormalizedLearnAboutDiamondsPage } from "@/services/education/learn-about-diamonds-page.types";
import EducationHeroSection from "./EducationHeroSection";
import EducationFourCsIntroSection from "./EducationFourCsIntroSection";
import EducationFourCsPanelsSection from "./EducationFourCsPanelsSection";
import EducationCertifiedSection from "./EducationCertifiedSection";
import EducationLearnMoreSection from "./EducationLearnMoreSection";
import EducationDiscoverSection from "./EducationDiscoverSection";
import EducationFaqSection from "./EducationFaqSection";

type EducationPageProps = Pick<NormalizedLearnAboutDiamondsPage, "hero" | "faq">;

const EducationPage = ({ hero, faq }: EducationPageProps) => {
  return (
    <>
      <EducationHeroSection hero={hero} />
      <EducationFourCsIntroSection />
      <EducationFourCsPanelsSection />
      <EducationCertifiedSection />
      <EducationLearnMoreSection />
      <EducationDiscoverSection />
      <EducationFaqSection faq={faq} />
    </>
  );
};

export default EducationPage;
