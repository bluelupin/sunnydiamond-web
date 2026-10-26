"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type {
  NormalizedGiftingGiftCard,
  NormalizedGiftingFinishingTouch,
  NormalizedGiftingGiftFinder,
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
import SeoSectionFallback from "@/shared/ui/SeoSectionFallback";

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
  giftFinder: NormalizedGiftingGiftFinder | null;
  discoverSection: ReactNode;
};

const GiftingBelowFoldLazy = ({
  intro,
  occasionGrid,
  perfectGift,
  giftCard,
  finishingTouch,
  trustBadges,
  giftFinder,
  discoverSection,
}: GiftingBelowFoldLazyProps) => (
  <>
    {intro ? (
      <GiftingLazyInView fallback={<SeoSectionFallback title={intro.title} description={intro.description} />}>
        <GiftingWithLoveSection intro={intro} />
      </GiftingLazyInView>
    ) : null}
    {occasionGrid ? (
      <GiftingLazyInView fallback={<SeoSectionFallback
        id="occasion-led-gifts"
        title="Timeless Pieces for Every Occasion"
        links={occasionGrid.cards.map((card) => ({ href: card.href, label: card.title }))}
      />}>
        <GiftingOccasionSection cards={occasionGrid.cards} />
      </GiftingLazyInView>
    ) : null}
    {perfectGift ? (
      <GiftingLazyInView fallback={<SeoSectionFallback
        id="gifting-products"
        title={perfectGift.title}
        description={perfectGift.description}
        links={[{ href: "/jewellery", label: "Explore diamond jewellery" }]}
      />}>
        <GiftingProductListSection perfectGift={perfectGift} />
      </GiftingLazyInView>
    ) : null}
    {discoverSection ? (
      <GiftingLazyInView fallback={giftFinder ? (
        <SeoSectionFallback title={giftFinder.title} description={giftFinder.description} />
      ) : <GiftingDiscoverSkeleton />}>
        {discoverSection}
      </GiftingLazyInView>
    ) : null}
    {giftCard ? (
      <GiftingLazyInView fallback={<SeoSectionFallback
        id="gift-card"
        title={giftCard.title}
        description={giftCard.description}
        links={[{ href: "/gift-card", label: giftCard.buttonLabel || "Explore gift cards" }]}
      />}>
        <GiftingGiftCardSection giftCard={giftCard} />
      </GiftingLazyInView>
    ) : null}
    {finishingTouch ? (
      <GiftingLazyInView fallback={<SeoSectionFallback title={finishingTouch.title} description={finishingTouch.description} />}>
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
