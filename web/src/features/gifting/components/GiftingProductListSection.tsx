"use client";

import { useMemo } from "react";
import FeaturedProductsCarousel from "@/features/cms/components/home/FeaturedProductsCarousel";
import {
  FeaturedCarouselSkeleton,
  FeaturedProductsHeader,
} from "@/features/cms/components/home/FeaturedProductsSection";
import { useMagentoTrendingProducts } from "@/hooks/magento/useMagentoTrendingProducts";
import { mapJewelleryListingToFeaturedCarouselItems } from "@/services/magento/products/trendingProducts.service";
import type { NormalizedGiftingPerfectGift } from "@/services/gifting/gifting-page.types";
import { giftingPageContent } from "../data/content";

type GiftingProductListSectionProps = {
  perfectGift: NormalizedGiftingPerfectGift;
};

const GiftingProductListSection = ({ perfectGift }: GiftingProductListSectionProps) => {
  const { products: section } = giftingPageContent;
  const { data: trendingProducts, isLoading } = useMagentoTrendingProducts();

  const items = useMemo(
    () => mapJewelleryListingToFeaturedCarouselItems(trendingProducts ?? []),
    [trendingProducts],
  );

  const isCarouselLoading = isLoading && items.length === 0;

  if (!isCarouselLoading && items.length === 0) {
    return null;
  }

  return (
    <section
      id="gifting-products"
      aria-labelledby="gifting-products-title"
      className="overflow-x-clip px-0 py-16 md:py-104"
      aria-label={perfectGift.title}
      aria-busy={isCarouselLoading}
    >
      <div className="flex w-full max-w-full flex-col items-center gap-10 overflow-x-clip">
        <FeaturedProductsHeader
          titleId="gifting-products-title"
          title={perfectGift.title}
          description={perfectGift.description ?? ""}
        />
        {isCarouselLoading ? (
          <FeaturedCarouselSkeleton />
        ) : (
          <FeaturedProductsCarousel
            items={items}
            ctaLabel={section.ctaLabel}
            sectionLabel={perfectGift.title}
            showCta={Boolean(section.ctaLabel)}
          />
        )}
      </div>
    </section>
  );
};

export default GiftingProductListSection;
