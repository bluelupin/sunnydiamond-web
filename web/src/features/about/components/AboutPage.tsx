import Layout from "@/shared/ui/layout/Layout";
import TrustBadgeSection from "@/features/cms/components/common/TrustBadges";
import AboutHeroSection from "./AboutHeroSection";
import AboutCraftingRaritySection from "./AboutCraftingRaritySection";
import AboutSince1997Section from "./AboutSince1997Section";
import AboutFacesSection from "./AboutFacesSection";
import AboutHandcraftedSection from "./AboutHandcraftedSection";
import AboutTimelineSection from "./AboutTimelineSection";
import AboutGuaranteesBar from "./AboutGuaranteesBar";
import AboutHeirloomQuoteSection from "./AboutHeirloomQuoteSection";

const AboutPage = () => {
  return (
    <Layout>
      <AboutHeroSection />
      <AboutCraftingRaritySection />
      <AboutSince1997Section />
      <AboutFacesSection />
      <AboutHandcraftedSection />
      <AboutTimelineSection />
      <AboutGuaranteesBar />
      <AboutHeirloomQuoteSection />
      <TrustBadgeSection />
    </Layout>
  );
};

export default AboutPage;
