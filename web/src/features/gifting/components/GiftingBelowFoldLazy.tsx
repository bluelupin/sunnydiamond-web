"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type {
  NormalizedGiftingGiftCard,
  NormalizedGiftingFinishingTouch,
  NormalizedGiftingIntro,
  NormalizedGiftingOccasionGrid,
  NormalizedGiftingPerfectGift,
  NormalizedGiftingTrustBadge,
} from "@/services/gifting/gifting-page.types";
import GiftingLazyInView from "./GiftingLazyInView";
import GiftingDiscoverSkeleton from "./skeletons/GiftingDiscoverSkeleton";
import GiftingGiftCardSkeleton from "./skeletons/GiftingGiftCardSkeleton";
import GiftingGuaranteesSkeleton from "./skeletons/GiftingGuaranteesSkeleton";
import GiftingOccasionSkeleton from "./skeletons/GiftingOccasionSkeleton";
import GiftingProductsSkeleton from "./skeletons/GiftingProductsSkeleton";
import GiftingPromiseSkeleton from "./skeletons/GiftingPromiseSkeleton";
import GiftingWithLoveSkeleton from "./skeletons/GiftingWithLoveSkeleton";

const GiftingWithLoveSection = dynamic(() => import("./GiftingWithLoveSection"), {
  loading: () => <GiftingWithLoveSkeleton />,
});

const GiftingOccasionSection = dynamic(() => import("./GiftingOccasionSection"), {
  loading: () => <GiftingOccasionSkeleton />,
});

const GiftingProductListSection = dynamic(() => import("./GiftingProductListSection"), {
  loading: () => <GiftingProductsSkeleton />,
});

const GiftingGiftCardSection = dynamic(() => import("./GiftingGiftCardSection"), {
  loading: () => <GiftingGiftCardSkeleton />,
});

const GiftingPromiseSection = dynamic(() => import("./GiftingPromiseSection"), {
  loading: () => <GiftingPromiseSkeleton />,
});

const GiftingGuaranteesSection = dynamic(() => import("./GiftingGuaranteesSection"), {
  loading: () => <GiftingGuaranteesSkeleton />,
});

type GiftingBelowFoldLazyProps = {
  intro: NormalizedGiftingIntro | null;
  occasionGrid: NormalizedGiftingOccasionGrid | null;
  perfectGift: NormalizedGiftingPerfectGift | null;
  giftCard: NormalizedGiftingGiftCard | null;
  finishingTouch: NormalizedGiftingFinishingTouch | null;
  trustBadges: NormalizedGiftingTrustBadge[];
  discoverSection: ReactNode;
};

const GiftingBelowFoldLazy = ({
  intro,
  occasionGrid,
  perfectGift,
  giftCard,
  finishingTouch,
  trustBadges,
  discoverSection,
}: GiftingBelowFoldLazyProps) => (
  <>
    {intro ? (
      <GiftingLazyInView fallback={<GiftingWithLoveSkeleton />}>
        <GiftingWithLoveSection intro={intro} />
      </GiftingLazyInView>
    ) : null}
    {occasionGrid ? (
      <GiftingLazyInView fallback={<GiftingOccasionSkeleton />}>
        <GiftingOccasionSection cards={occasionGrid.cards} />
      </GiftingLazyInView>
    ) : null}
    {perfectGift ? (
      <GiftingLazyInView fallback={<GiftingProductsSkeleton />}>
        <GiftingProductListSection perfectGift={perfectGift} />
      </GiftingLazyInView>
    ) : null}
    {discoverSection ? (
      <GiftingLazyInView fallback={<GiftingDiscoverSkeleton />}>
        {discoverSection}
      </GiftingLazyInView>
    ) : null}
    {giftCard ? (
      <GiftingLazyInView fallback={<GiftingGiftCardSkeleton />}>
        <GiftingGiftCardSection giftCard={giftCard} />
      </GiftingLazyInView>
    ) : null}
    {finishingTouch ? (
      <GiftingLazyInView fallback={<GiftingPromiseSkeleton />}>
        <GiftingPromiseSection finishingTouch={finishingTouch} />
      </GiftingLazyInView>
    ) : null}
    {trustBadges.length > 0 ? (
      <GiftingLazyInView fallback={<GiftingGuaranteesSkeleton />}>
        <GiftingGuaranteesSection trustBadges={trustBadges} />
      </GiftingLazyInView>
    ) : null}
  </>
);

export default GiftingBelowFoldLazy;
