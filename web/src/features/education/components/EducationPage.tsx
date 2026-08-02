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
  "hero" | "faq" | "ctaBanner" | "fourCsIntro" | "fourCs" | "certificate" | "learnMore"
>;

const EducationPage = ({
  hero,
  fourCsIntro,
  ctaBanner,
  fourCs,
  certificate,
  learnMore,
  faq,
}: EducationPageProps) => {
  return (
    <>
      {hero ? <EducationHeroSection {...hero} /> : null}
      {fourCsIntro ? <EducationFourCsIntroSection intro={fourCsIntro} /> : null}
      {fourCs ? <EducationFourCsPanelsSection fourCs={fourCs} /> : null}
      {certificate ? <EducationCertifiedSection certificate={certificate} /> : null}
      {learnMore ? <EducationLearnMoreSection learnMore={learnMore} /> : null}
      {ctaBanner ? <EducationDiscoverSection ctaBanner={ctaBanner} /> : null}
      {faq ? <EducationFaqSection faq={faq} /> : null}
    </>
  );
};

export default EducationPage;
