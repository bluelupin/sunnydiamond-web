import Layout from "@/shared/ui/layout/Layout";
import AboutHeroSection from "@/features/cms/components/about/AboutHeroSection";
import AboutHistorySection from "@/features/cms/components/about/AboutHistorySection";
import AboutLeadershipSection from "@/features/cms/components/about/AboutLeadershipSection";
import AboutCraftsmanshipSection from "@/features/cms/components/about/AboutCraftsmanshipSection";
import AboutStoreSection from "@/features/cms/components/about/AboutStoreSection";
import AboutTrustSection from "@/features/cms/components/about/AboutTrustSection";
import AboutTaglineSection from "@/features/cms/components/about/AboutTaglineSection";
import { aboutPageContent } from "@/features/cms/data/aboutContent";

const AboutPage = () => {
  return (
    <Layout>
      <AboutHeroSection id="hero" content={aboutPageContent.hero} />
      <AboutHistorySection id="history" content={aboutPageContent.history} />
      <AboutLeadershipSection id="leadership" content={aboutPageContent.leadership} />
      <AboutCraftsmanshipSection id="craftsmanship" content={aboutPageContent.craftsmanship} />
      <AboutStoreSection id="store" content={aboutPageContent.store} />
      <AboutTrustSection id="trust" badges={aboutPageContent.trustBadges} />
      <AboutTaglineSection id="tagline" content={aboutPageContent.tagline} />
    </Layout>
  );
};

export default AboutPage;
