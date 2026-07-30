"use client";

import { useMemo } from "react";
import Reveal from "@/shared/Animation/Reveal";
import FeaturedProductsCarousel from "@/features/cms/components/home/FeaturedProductsCarousel";
import JewelleryProductGridSkeleton from "@/features/jewellery-product/components/skeletons/JewelleryProductGridSkeleton";
import { useMagentoTrendingProducts } from "@/hooks/magento/useMagentoTrendingProducts";
import { mapJewelleryListingToFeaturedCarouselItems } from "@/services/magento/products/trendingProducts.service";
import { giftingPageContent } from "../data/content";

const PRODUCT_LIMIT = 9;

const GiftingProductListSection = () => {
  const { products: section } = giftingPageContent;
  const { data: trendingProducts, isLoading } = useMagentoTrendingProducts();

  const items = useMemo(
    () => mapJewelleryListingToFeaturedCarouselItems((trendingProducts ?? []).slice(0, PRODUCT_LIMIT)),
    [trendingProducts],
  );

  return (
    <section
      id="gifting-products"
      aria-labelledby="gifting-products-title"
      className="px-4 py-16 md:px-10 md:py-100"
    >
      <div className="mx-auto flex w-full max-w-1440 flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal
            as="h2"
            id="gifting-products-title"
            direction="up"
            className="font-larken text-5xl font-light leading-110 text-darkblack"
          >
            {section.title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-xl font-light leading-110 text-neutral500"
          >
            {section.description}
          </Reveal>
        </div>

        {isLoading && items.length === 0 ? (
          <JewelleryProductGridSkeleton count={3} />
        ) : items.length > 0 ? (
          <FeaturedProductsCarousel
            items={items}
            ctaLabel={section.ctaLabel}
            sectionLabel={section.title}
            showCta={false}
          />
        ) : null}
      </div>
    </section>
  );
};

export default GiftingProductListSection;
