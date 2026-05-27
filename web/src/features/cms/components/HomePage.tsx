import Layout from "@/shared/ui/layout/Layout";
import HeroSection from "@/features/cms/components/home/HeroSection";
import SectionNav from "@/features/cms/components/home/SectionNav";
import CraftingRaritySection from "@/features/cms/components/home/CraftingRaritySection";
import DiamondSourcingSection from "@/features/cms/components/home/DiamondSourcingSection";
import AlankaraShowcase from "@/features/cms/components/home/AlankaraShowcase";
import DiamondAwaits from "@/features/cms/components/home/DiamondAwaits";
import CategoryGrid from "./home/CategoryGrid";
import CraftsmanshipProcess from "./home/CraftsmanshipProcessLazy";
import BrandPromises from "./home/BrandPromises";
import ForYouForever from "./home/ForYouForever";
import ShowroomsSection from "@/features/stores/components/ShowroomsSection";
import ApiDebugLogger from "@/shared/ui/ApiDebugLogger";
import type { HomepageResponse } from "@/services/homepage.service";

type HomePageProps = {
  homeData: HomepageResponse;
};

const showApiDebug = process.env.NEXT_PUBLIC_API_DEBUG === "true";

const HomePage = ({ homeData }: HomePageProps) => {
  return (
    <Layout>
      <SectionNav />
      {showApiDebug ? <ApiDebugLogger /> : null}
      <HeroSection id="hero" homeData={homeData} />
      <CraftingRaritySection id="crafting-rarity" homeData={homeData} />
      <DiamondSourcingSection id="flawless" diamondSourcingSection={homeData?.diamondSourcingSection} />
      <AlankaraShowcase id="alankara" homeData={homeData} />
      <DiamondAwaits id="diamond-awaits" homeData={homeData} />
      <CategoryGrid id="categories" homeData={homeData} />
      <CraftsmanshipProcess id="craftsmanship" homeData={homeData} />
      <BrandPromises id="promise" homeData={homeData} />
      <ForYouForever id="for-you" homeData={homeData} />
      <ShowroomsSection id="showrooms" homeData={homeData} />
    </Layout>
  );
};

export default HomePage;
