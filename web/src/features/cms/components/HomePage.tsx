import HeroSection from "@/features/cms/components/home/HeroSection";
import SectionNav from "@/features/cms/components/home/SectionNav";
import CraftingRaritySection from "@/features/cms/components/home/CraftingRaritySection";
import DiamondSourcingSection from "@/features/cms/components/home/DiamondSourcingSection";
import FeaturedCollectionSection from "@/features/cms/components/home/FeaturedCollectionSection";
import FeaturedProductsSection from "@/features/cms/components/home/FeaturedProductsSection";
import CraftsmanshipProcess from "./home/CraftsmanshipProcessLazy";
import ForYourValentineSection from "@/features/cms/components/home/ForYourValentineSection";
import SunnyPromiseSection from "@/features/cms/components/home/SunnyPromiseSection";
import BespokeForYouSection from "@/features/cms/components/home/BespokeForYouSection";
import DiamondsForEveryoneSection from "@/features/cms/components/home/DiamondsForEveryoneSection";
import OccasionsTeaserSection from "@/features/cms/components/home/OccasionsTeaserSection";
import ShowroomsSection from "@/features/stores/components/ShowroomsSection";
import ApiDebugLogger from "@/shared/ui/ApiDebugLogger";

const showApiDebug = process.env.NEXT_PUBLIC_API_DEBUG === "true";

const HomePage = () => {
  return (
    <>
      <SectionNav />
      {showApiDebug ? <ApiDebugLogger /> : null}
      <HeroSection id="hero" />
      <CraftingRaritySection id="crafting-rarity" />
      <DiamondSourcingSection id="flawless" />
      <FeaturedCollectionSection id="alankara" />
      <FeaturedProductsSection id="diamond-awaits" />
      <OccasionsTeaserSection id="categories" />
      <CraftsmanshipProcess id="craftsmanship" />
      <ForYourValentineSection id="valentine" />
      <SunnyPromiseSection id="promise" />
      <BespokeForYouSection id="bespoke-for-you" />
      <DiamondsForEveryoneSection id="diamonds-for-everyone" />
      <ShowroomsSection id="showrooms" />
    </>
  );
};

export default HomePage;
