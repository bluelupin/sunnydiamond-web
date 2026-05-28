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

const showApiDebug = process.env.NEXT_PUBLIC_API_DEBUG === "true";

const HomePage = () => {
  return (
    <Layout>
      <SectionNav />
      {showApiDebug ? <ApiDebugLogger /> : null}
      <HeroSection id="hero" />
      <CraftingRaritySection id="crafting-rarity" />
      <DiamondSourcingSection id="flawless" />
      <AlankaraShowcase id="alankara" />
      <DiamondAwaits id="diamond-awaits" />
      <CategoryGrid id="categories" />
      <CraftsmanshipProcess id="craftsmanship" />
      <BrandPromises id="promise" />
      <ForYouForever id="for-you" />
      <ShowroomsSection id="showrooms" />
    </Layout>
  );
};

export default HomePage;
