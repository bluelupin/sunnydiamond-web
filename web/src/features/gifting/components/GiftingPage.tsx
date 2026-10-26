import { Suspense } from "react";
import type { NormalizedGiftingPage } from "@/services/gifting/gifting-page.types";
import GiftingBelowFoldLazy from "./GiftingBelowFoldLazy";
import GiftingDiscoverOptionsLoader from "./GiftingDiscoverOptionsLoader";
import GiftingDiscoverSection from "./GiftingDiscoverSection";
import GiftingHeroSection from "./GiftingHeroSection";

type GiftingPageProps = {
  page: NormalizedGiftingPage;
};

const GiftingPage = ({ page }: GiftingPageProps) => {
  const discoverSection = page.giftFinder ? (
    <Suspense fallback={<GiftingDiscoverSection giftFinder={page.giftFinder} />}>
      <GiftingDiscoverOptionsLoader giftFinder={page.giftFinder} />
    </Suspense>
  ) : null;

  return (
    <>
      {page.hero && <GiftingHeroSection hero={page.hero} />}
      <GiftingBelowFoldLazy
        intro={page.intro}
        occasionGrid={page.occasionGrid}
        perfectGift={page.perfectGift}
        giftCard={page.giftCard}
        finishingTouch={page.finishingTouch}
        trustBadges={page.trustBadges}
        giftFinder={page.giftFinder}
        discoverSection={discoverSection}
      />
    </>
  );
};

export default GiftingPage;
