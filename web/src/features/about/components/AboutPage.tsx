import TrustBadgeSection from "@/features/cms/components/common/TrustBadges";
import type { NormalizedAboutPage } from "@/services/about/about-page.types";
import AboutBelowFoldLazy from "./AboutBelowFoldLazy";
import AboutHeroSection from "./AboutHeroSection";
import AboutGuaranteesBar from "./AboutGuaranteesBar";
import AboutHeirloomQuoteSection from "./AboutHeirloomQuoteSection";
import AboutBrillianceSection from "./AboutBrillianceSection";

type AboutPageProps = {
  page: NormalizedAboutPage;
};

const AboutPage = ({ page }: AboutPageProps) => {
  return (
    <>
      {page.hero ? <AboutHeroSection {...page.hero} /> : null}
      {page.craftingRarity ? (
        <AboutBrillianceSection {...page.craftingRarity} />
      ) : null}
      <AboutBelowFoldLazy
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
