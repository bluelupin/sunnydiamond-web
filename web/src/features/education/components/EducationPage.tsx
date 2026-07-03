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
  "hero" | "faq" | "ctaBanner" | "fourCsIntro" | "fourCs" | "certificate"
>;

const EducationPage = ({
  hero,
  fourCsIntro,
  ctaBanner,
  fourCs,
  certificate,
  faq,
}: EducationPageProps) => {
  return (
    <>
      {hero ? <EducationHeroSection {...hero} /> : null}
      <EducationFourCsIntroSection intro={fourCsIntro} />
      <EducationFourCsPanelsSection fourCs={fourCs} />
      <EducationCertifiedSection certificate={certificate} />
      <EducationLearnMoreSection />
      <EducationDiscoverSection ctaBanner={ctaBanner} />
      <EducationFaqSection faq={faq} />
    </>
  );
};

export default EducationPage;
