import TrustBadgeSection from "@/features/cms/components/common/TrustBadges";
import type { NormalizedAboutPage } from "@/services/about/about-page.types";
import AboutHeroSection from "./AboutHeroSection";
import AboutCraftingRaritySection from "./AboutCraftingRaritySection";
import AboutSince1997Section from "./AboutSince1997Section";
import AboutFacesSection from "./AboutFacesSection";
import AboutHandcraftedSection from "./AboutHandcraftedSection";
import AboutTimelineSection from "./AboutTimelineSection";
import AboutGuaranteesBar from "./AboutGuaranteesBar";
import AboutHeirloomQuoteSection from "./AboutHeirloomQuoteSection";

type AboutPageProps = {
  page: NormalizedAboutPage;
};

const AboutPage = ({ page }: AboutPageProps) => {
  return (
    <>
      {page.hero ? <AboutHeroSection {...page.hero} /> : null}
      {page.craftingRarity ? (
        <AboutCraftingRaritySection {...page.craftingRarity} />
      ) : null}
      {page.legacy ? <AboutSince1997Section {...page.legacy} /> : null}
      {page.team ? <AboutFacesSection {...page.team} /> : null}
      {page.craft ? <AboutHandcraftedSection {...page.craft} /> : null}
      {page.timeline ? <AboutTimelineSection {...page.timeline} /> : null}
      {page.trustBadges ? <AboutGuaranteesBar badges={page.trustBadges} /> : null}
      {page.brandTagline ? (
        <AboutHeirloomQuoteSection {...page.brandTagline} />
      ) : null}
      <TrustBadgeSection />
    </>
  );
};

export default AboutPage;
