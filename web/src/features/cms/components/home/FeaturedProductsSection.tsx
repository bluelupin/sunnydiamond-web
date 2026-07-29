"use client";

import { useMemo } from "react";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { useMagentoTrendingProducts } from "@/hooks/magento/useMagentoTrendingProducts";
import { isSectionActive } from "@/shared/utils/cmsSection";
import Reveal from "@/shared/Animation/Reveal";
import FeaturedProductsCarousel from "@/features/cms/components/home/FeaturedProductsCarousel";
import { mapJewelleryListingToFeaturedCarouselItems } from "@/services/magento/products/trendingProducts.service";

/** Recommended transparent product PNG/WebP for CMS uploads. */
export const FEATURED_PRODUCTS_IMAGE_SPEC = {
  /** Primary center slide — Figma display ~774px; upload 2× for retina. */
  width: 1600,
  height: 1600,
  aspectRatio: "1:1" as const,
  format: "PNG or WebP with transparent background",
  notes:
    "Center the product with ~12–15% padding on all sides so side peeks and object-contain crops stay clean.",
} as const;

interface FeaturedProductsSectionProps {
  id?: string;
}

function FeaturedProductsHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 text-center md:px-0">
      {title ? (
        <Reveal
          as="h2"
          direction="up"
          className="font-larken text-32 font-light leading-110 text-darkblack md:text-[40px] lg:text-5xl"
        >
          {title}
        </Reveal>
      ) : null}
      {description ? (
        <Reveal
          direction="up"
          className="max-w-[306px] font-gill text-base font-light leading-110 text-neutral500 lg:max-w-none lg:text-xl"
        >
          {description}
        </Reveal>
      ) : null}
    </div>
  );
}

const FeaturedCarouselSkeleton = () => (
  <div className="relative h-[275px] w-full sm:h-[303px] md:h-[411px]">
    <div className="absolute left-1/2 top-0 h-[155px] w-[200px] -translate-x-1/2 animate-pulse rounded bg-gray200 sm:h-[170px] sm:w-[260px] md:h-[259px] md:w-[600px]" aria-hidden />
  </div>
);

const FeaturedProductsSection = ({ id }: FeaturedProductsSectionProps) => {
  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();
  const { data: trendingProducts, isLoading: isTrendingLoading } = useMagentoTrendingProducts();
  const featuredProductsData =
    shoppingData?.homepage?.featuredProductsSection || shoppingData?.featuredProductsSection;

  const sectionTitle = featuredProductsData?.sectionTitle?.trim() ?? "";
  const description = featuredProductsData?.description?.trim() ?? "";
  const ctaLabel = featuredProductsData?.cta?.label?.trim() ?? "";

  const items = useMemo(
    () => mapJewelleryListingToFeaturedCarouselItems(trendingProducts ?? []),
    [trendingProducts],
  );

  const isCarouselLoading = isTrendingLoading && items.length === 0;
  const showSectionShell = !isShoppingLoading || Boolean(sectionTitle || description);

  if (!isSectionActive(featuredProductsData?.isActive)) {
    return null;
  }

  if (!showSectionShell && isCarouselLoading) {
    return (
      <section
        id={id}
        className="overflow-visible px-4 py-16 md:px-10 md:py-104"
        aria-label="Featured diamond carousel"
        aria-busy="true"
      >
        <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-10 overflow-visible">
          <div className="flex w-full flex-col items-center gap-4 text-center">
            <div className="h-[35px] w-[283px] animate-pulse rounded bg-gray200 md:h-[53px] md:w-[424px]" aria-hidden />
            <div className="h-[36px] w-[306px] animate-pulse rounded bg-gray200 md:h-[22px] md:w-[517px]" aria-hidden />
          </div>
          <FeaturedCarouselSkeleton />
        </div>
      </section>
    );
  }

  if (!isCarouselLoading && items.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className="overflow-x-clip px-0 py-16 md:py-104"
      aria-label="Featured diamond carousel"
      aria-busy={isCarouselLoading}
    >
      <div className="flex w-full max-w-full flex-col items-center gap-10 overflow-x-clip">
        {sectionTitle || description ? (
          <FeaturedProductsHeader title={sectionTitle} description={description} />
        ) : null}
        {isCarouselLoading ? (
          <FeaturedCarouselSkeleton />
        ) : (
          <FeaturedProductsCarousel
            items={items}
            ctaLabel={ctaLabel}
            sectionLabel={sectionTitle || "Featured products"}
            showCta={Boolean(ctaLabel)}
          />
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
