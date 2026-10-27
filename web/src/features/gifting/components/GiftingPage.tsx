import { Suspense } from "react";
import type { NormalizedGiftingPage } from "@/services/gifting/gifting-page.types";
import GiftingBelowFoldLazy from "./GiftingBelowFoldLazy";
import GiftingDiscoverOptionsLoader from "./GiftingDiscoverOptionsLoader";
import GiftingDiscoverSection from "./GiftingDiscoverSection";
import GiftingHeroSection from "./GiftingHeroSection";
import MagentoTrendingSeeder from "@/shared/lib/providers/MagentoTrendingSeeder";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

type GiftingPageProps = {
  page: NormalizedGiftingPage;
  trendingProducts?: JewelleryListingProduct[];
};

const GiftingPage = ({ page, trendingProducts }: GiftingPageProps) => {
  const discoverSection = page.giftFinder ? (
    <Suspense fallback={<GiftingDiscoverSection giftFinder={page.giftFinder} />}>
      <GiftingDiscoverOptionsLoader giftFinder={page.giftFinder} />
    </Suspense>
  ) : null;

  return (
    <>
      {trendingProducts ? <MagentoTrendingSeeder trendingProducts={trendingProducts} /> : null}
      {page.hero && <GiftingHeroSection hero={page.hero} />}
      <GiftingBelowFoldLazy
        intro={page.intro}
        occasionGrid={page.occasionGrid}
        perfectGift={page.perfectGift}
        giftCard={page.giftCard}
        finishingTouch={page.finishingTouch}
        trustBadges={page.trustBadges}
        giftFinder={page.giftFinder}
        trendingProducts={trendingProducts ?? []}
        discoverSection={discoverSection}
      />
    </>
  );
};

export default GiftingPage;
