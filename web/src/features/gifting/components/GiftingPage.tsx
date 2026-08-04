import { Suspense } from "react";
import type { NormalizedGiftingPage } from "@/services/gifting/gifting-page.types";
import GiftingDiscoverOptionsLoader from "./GiftingDiscoverOptionsLoader";
import GiftingDiscoverSection from "./GiftingDiscoverSection";
import GiftingGiftCardSection from "./GiftingGiftCardSection";
import GiftingGuaranteesSection from "./GiftingGuaranteesSection";
import GiftingIntroSection from "./GiftingIntroSection";
import GiftingOccasionSection from "./GiftingOccasionSection";
import GiftingProductListSection from "./GiftingProductListSection";
import GiftingPromiseSection from "./GiftingPromiseSection";
import GiftingWithLoveSection from "./GiftingWithLoveSection";

type GiftingPageProps = {
  page: NormalizedGiftingPage;
};

const GiftingPage = ({ page }: GiftingPageProps) => {
  return (
    <>
      {page.hero ? <GiftingIntroSection hero={page.hero} /> : null}
      {page.intro ? <GiftingWithLoveSection intro={page.intro} /> : null}
      {page.occasionGrid?.cards.length ? (
        <GiftingOccasionSection cards={page.occasionGrid.cards} />
      ) : null}
      {page.perfectGift ? (
        <GiftingProductListSection perfectGift={page.perfectGift} />
      ) : null}
      {page.giftFinder ? (
        <Suspense fallback={<GiftingDiscoverSection giftFinder={page.giftFinder} />}>
          <GiftingDiscoverOptionsLoader giftFinder={page.giftFinder} />
        </Suspense>
      ) : null}
      {page.giftCard ? <GiftingGiftCardSection giftCard={page.giftCard} /> : null}
      {page.finishingTouch ? (
        <GiftingPromiseSection finishingTouch={page.finishingTouch} />
      ) : null}
      <GiftingGuaranteesSection trustBadges={page.trustBadges} />
    </>
  );
};

export default GiftingPage;
