import type { NormalizedLearnAboutDiamondsPage } from "@/services/education/learn-about-diamonds-page.types";
import EducationHeroSection from "./EducationHeroSection";
import EducationFourCsIntroSection from "./EducationFourCsIntroSection";
import EducationFourCsPanelsSection from "./EducationFourCsPanelsSection";
import EducationCertifiedSection from "./EducationCertifiedSection";
import EducationLearnMoreSection from "./EducationLearnMoreSection";
import EducationDiscoverSection from "./EducationDiscoverSection";
import EducationFaqSection from "./EducationFaqSection";

type EducationPageProps = Pick<
  NormalizedLearnAboutDiamondsPage,
  "hero" | "faq" | "ctaBanner" | "fourCs"
>;

const EducationPage = ({ hero, faq, ctaBanner, fourCs }: EducationPageProps) => {
  return (
    <>
      <EducationHeroSection hero={hero} />
      <EducationFourCsIntroSection />
      <EducationFourCsPanelsSection fourCs={fourCs} />
      <EducationCertifiedSection />
      <EducationLearnMoreSection />
      <EducationDiscoverSection ctaBanner={ctaBanner} />
      <EducationFaqSection faq={faq} />
    </>
  );
};

export default EducationPage;
