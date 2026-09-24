import dynamic from "next/dynamic";
import HeroSection from "@/features/cms/components/home/HeroSection";
import CraftingRaritySection from "@/features/cms/components/home/CraftingRaritySection";
import HomeBelowFoldSections from "@/features/cms/components/home/HomeBelowFoldSections";
import HomepagePerformanceReporter from "@/features/cms/components/home/HomepagePerformanceReporter";
import ApiDebugLogger from "@/shared/ui/ApiDebugLogger";
import { FeatureErrorBoundary } from "@/shared/ui/FeatureErrorBoundary";
import type {
  ResolvedCraftingRarityContent,
  ResolvedHeroContent,
} from "@/lib/homepage/resolveHomepageAboveFold";

const SectionNav = dynamic(
  () => import("@/features/cms/components/home/SectionNav"),
);

const showApiDebug = process.env.NEXT_PUBLIC_API_DEBUG === "true";

type HomePageProps = {
  hero: ResolvedHeroContent | null;
  craftingRarity: ResolvedCraftingRarityContent;
};

const HomePage = ({ hero, craftingRarity }: HomePageProps) => {
  return (
    <>
      <HomepagePerformanceReporter hasHeroContent={Boolean(hero)} />
      <FeatureErrorBoundary featureName="SectionNav">
        <SectionNav />
      </FeatureErrorBoundary>
      {showApiDebug ? <ApiDebugLogger /> : null}
      <HeroSection id="hero" hero={hero} />
      <CraftingRaritySection id="crafting-rarity" content={craftingRarity} />
      <HomeBelowFoldSections />
    </>
  );
};

export default HomePage;
