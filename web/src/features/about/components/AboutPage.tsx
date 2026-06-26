import type { NormalizedAboutPage } from "@/services/about/about-page.types";
import AboutBelowFoldLazy from "./AboutBelowFoldLazy";
import AboutBrillianceSection from "./AboutBrillianceSection";
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
      {page.brillianceSection ? (
        <AboutBrillianceSection {...page.brillianceSection} />
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
    </>
  );
};

export default AboutPage;
