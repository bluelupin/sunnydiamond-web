import HeroSection from "@/features/cms/components/home/HeroSection";
import CraftingRaritySection from "@/features/cms/components/home/CraftingRaritySection";
import HomeBelowFoldSections from "@/features/cms/components/home/HomeBelowFoldSections";
import HomepagePerformanceReporter from "@/features/cms/components/home/HomepagePerformanceReporter";
import ApiDebugLogger from "@/shared/ui/ApiDebugLogger";
import type {
  ResolvedCraftingRarityContent,
  ResolvedHeroContent,
} from "@/lib/homepage/resolveHomepageAboveFold";
import type {
  NormalizedBespokeFeaturedStories,
  NormalizedBespokePastCreations,
} from "@/services/bespoke/contact-bespoke-page.types";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

const showApiDebug = process.env.NEXT_PUBLIC_API_DEBUG === "true";

type HomePageProps = {
  hero: ResolvedHeroContent | null;
  craftingRarity: ResolvedCraftingRarityContent;
  pastCreations?: NormalizedBespokePastCreations | null;
  featuredStories?: Pick<
    NormalizedBespokeFeaturedStories,
    "slides" | "defaultSlideIndex" | "modalCtaLabel"
  > | null;
  trendingProducts: JewelleryListingProduct[];
};

const HomePage = ({
  hero,
  craftingRarity,
  pastCreations = null,
  featuredStories = null,
  trendingProducts,
}: HomePageProps) => {
  return (
    <>
      <HomepagePerformanceReporter hasHeroContent={Boolean(hero)} />
      {showApiDebug ? <ApiDebugLogger /> : null}
      <HeroSection id="hero" hero={hero} />
      <CraftingRaritySection id="crafting-rarity" content={craftingRarity} />
      <HomeBelowFoldSections
        pastCreations={pastCreations}
        featuredStories={featuredStories}
        trendingProducts={trendingProducts}
      />
    </>
  );
};

export default HomePage;
