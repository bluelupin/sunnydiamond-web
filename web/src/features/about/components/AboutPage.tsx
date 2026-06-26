import TrustBadgeSection from "@/features/cms/components/common/TrustBadges";
import type { NormalizedAboutPage } from "@/services/about/about-page.types";
import AboutBelowFoldLazy from "./AboutBelowFoldLazy";
import AboutHeroSection from "./AboutHeroSection";
import AboutGuaranteesBar from "./AboutGuaranteesBar";
import AboutHeirloomQuoteSection from "./AboutHeirloomQuoteSection";

type AboutPageProps = {
  page: NormalizedAboutPage;
};

const AboutPage = ({ page }: AboutPageProps) => {
  return (
    <>
      {page.hero ? <AboutHeroSection {...page.hero} /> : null}
      <AboutBelowFoldLazy
        brillianceSection={page.brillianceSection}
        legacy={page.legacy}
        team={page.team}
        craft={page.craft}
        timeline={page.timeline}
      />
      {page.trustBadges ? <AboutGuaranteesBar badges={page.trustBadges} /> : null}
      {page.brandTagline ? (
        <AboutHeirloomQuoteSection {...page.brandTagline} />
      ) : null}
      <TrustBadgeSection />
    </>
  );
};

export default AboutPage;
