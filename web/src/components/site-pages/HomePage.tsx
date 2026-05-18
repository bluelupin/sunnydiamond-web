import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import SectionNav from "@/components/home/SectionNav";
import CraftingRaritySection from "@/components/home/CraftingRaritySection";
import FlawlessDiamonds from "@/components/home/FlawlessDiamonds";
import AlankaraShowcase from "@/components/home/AlankaraShowcase";
import DiamondAwaits from "@/components/home/DiamondAwaits";
import CategoryGrid from "../home/CategoryGrid";
import CraftsmanshipProcess from "../home/CraftsmanshipProcessLazy";
import BrandPromises from "../home/BrandPromises";
import ForYouForever from "../home/ForYouForever";
import ShowroomsSection from "../home/ShowroomsSection";

const HomePage = () => {
  return (
    <Layout>
      <SectionNav />

      <HeroSection id="hero" />
      <CraftingRaritySection id="crafting-rarity" />
      <FlawlessDiamonds id="flawless" />
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
