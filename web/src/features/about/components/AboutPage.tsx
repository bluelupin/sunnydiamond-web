import type { NormalizedAboutPage } from "@/services/about/about-page.types";
import AboutBelowFoldLazy from "./AboutBelowFoldLazy";
import AboutBrillianceLazy from "./AboutBrillianceLazy";
import AboutFooterLazy from "./AboutFooterLazy";
import AboutHeroSection from "./AboutHeroSection";

type AboutPageProps = {
  page: NormalizedAboutPage;
};

const AboutPage = ({ page }: AboutPageProps) => {
  return (
    <>
      {page.hero ? <AboutHeroSection {...page.hero} /> : null}
      {page.brillianceSection ? (
        <AboutBrillianceLazy {...page.brillianceSection} />
      ) : null}
      <AboutBelowFoldLazy
        legacy={page.legacy}
        team={page.team}
        craft={page.craft}
        timeline={page.timeline}
      />
      <AboutFooterLazy
        trustBadges={page.trustBadges}
        brandTagline={page.brandTagline}
      />
    </>
  );
};

export default AboutPage;
