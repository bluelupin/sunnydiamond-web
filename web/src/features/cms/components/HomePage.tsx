import Layout from "@/shared/ui/layout/Layout";
import HeroSection from "@/features/cms/components/home/HeroSection";
import SectionNav from "@/features/cms/components/home/SectionNav";
import CraftingRaritySection from "@/features/cms/components/home/CraftingRaritySection";
import DiamondSourcingSection from "@/features/cms/components/home/DiamondSourcingSection";
import FeaturedCollectionSection from "@/features/cms/components/home/FeaturedCollectionSection";
import FeaturedProductsSection from "@/features/cms/components/home/FeaturedProductsSection";
import ForYouForever from "@/features/cms/components/home/ForYouForever";
import CraftsmanshipProcess from "./home/CraftsmanshipProcessLazy";
import SunnyPromiseSection from "@/features/cms/components/home/SunnyPromiseSection";
import OccasionsTeaserSection from "@/features/cms/components//home/OccasionsTeaserSection";
import ShowroomsSection from "@/features/stores/components/ShowroomsSection";
import ApiDebugLogger from "@/shared/ui/ApiDebugLogger";

const showApiDebug = process.env.NEXT_PUBLIC_API_DEBUG === "true";

const HomePage = () => {
  return (
    <Layout>
      <SectionNav />
      {showApiDebug ? <ApiDebugLogger /> : null}
      <HeroSection id="hero" />
      <CraftingRaritySection id="crafting-rarity" />
      <DiamondSourcingSection id="flawless" />
      <FeaturedCollectionSection id="alankara" />
      <FeaturedProductsSection id="diamond-awaits" />
      <OccasionsTeaserSection id="categories" />
      <CraftsmanshipProcess id="craftsmanship" />
      <SunnyPromiseSection id="promise" />
      <ForYouForever id="for-you" />
      <ShowroomsSection id="showrooms" />
    </Layout>
  );
};

export default HomePage;
