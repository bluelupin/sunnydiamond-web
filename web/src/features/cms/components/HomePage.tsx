import HeroSection from "@/features/cms/components/home/HeroSection";
import SectionNav from "@/features/cms/components/home/SectionNav";
import CraftingRaritySection from "@/features/cms/components/home/CraftingRaritySection";
import HomeBelowFoldSections from "@/features/cms/components/home/HomeBelowFoldSections";
import ApiDebugLogger from "@/shared/ui/ApiDebugLogger";

const showApiDebug = process.env.NEXT_PUBLIC_API_DEBUG === "true";

const HomePage = () => {
  return (
    <>
      <SectionNav />
      {showApiDebug ? <ApiDebugLogger /> : null}
      <HeroSection id="hero" />
      <CraftingRaritySection id="crafting-rarity" />
      <HomeBelowFoldSections />
    </>
  );
};

export default HomePage;
