"use client";

import { useMemo } from "react";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import {
  featuredProductsCarouselFallbackImages,
  featuredProductsCarouselFallbackItems,
} from "@/features/cms/data/featuredProductsFallback";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import Reveal from "@/shared/Animation/Reveal";
import FeaturedProductsCarousel, {
  type FeaturedCarouselItem,
} from "@/features/cms/components/home/FeaturedProductsCarousel";

/** Recommended transparent product PNG/WebP for CMS + fallbacks. */
export const FEATURED_PRODUCTS_IMAGE_SPEC = {
  /** Primary center slide — Figma display ~774px; upload 2× for retina. */
  width: 1600,
  height: 1600,
  aspectRatio: "1:1" as const,
  format: "PNG or WebP with transparent background",
  notes:
    "Center the product with ~12–15% padding on all sides so side peeks and object-contain crops stay clean.",
} as const;

const FALLBACK_TITLE = "Your Diamond Awaits";
const FALLBACK_DESCRIPTION =
  "Traditional mastery bringing every diamond to radiant, eternal life.";

interface FeaturedProductsSectionProps {
  id?: string;
}

const FEATURED_CAROUSEL_COUNT = 3;

function getFallbackItems(): FeaturedCarouselItem[] {
  return featuredProductsCarouselFallbackItems.slice(0, FEATURED_CAROUSEL_COUNT);
}

function normalizeCarouselItems(cmsItems: FeaturedCarouselItem[]): FeaturedCarouselItem[] {
  const fallbacks = getFallbackItems();

  if (cmsItems.length === 0) {
    return fallbacks;
  }

  if (cmsItems.length >= FEATURED_CAROUSEL_COUNT) {
    return cmsItems.slice(0, FEATURED_CAROUSEL_COUNT);
  }

  const merged = [...cmsItems];
  for (const fallback of fallbacks) {
    if (merged.length >= FEATURED_CAROUSEL_COUNT) break;
    if (!merged.some((item) => String(item.id) === String(fallback.id))) {
      merged.push(fallback);
    }
  }

  return merged.slice(0, FEATURED_CAROUSEL_COUNT);
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
      <Reveal
        as="h2"
        direction="up"
        className="font-larken text-32 font-light leading-110 text-darkblack md:text-[40px] lg:text-[48px]"
      >
        {title}
      </Reveal>
      <Reveal
        direction="up"
        className="max-w-[306px] font-gill text-base font-light leading-110 text-neutral500 lg:max-w-none lg:text-20"
      >
        {description}
      </Reveal>
    </div>
  );
}

const FeaturedProductsSection = ({ id }: FeaturedProductsSectionProps) => {
  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();
  const featuredProductsData =
    shoppingData?.homepage?.featuredProductsSection || shoppingData?.featuredProductsSection;

  const sectionTitle = featuredProductsData?.sectionTitle?.trim() || FALLBACK_TITLE;
  const description = featuredProductsData?.description?.trim() || FALLBACK_DESCRIPTION;
  const ctaLabel = featuredProductsData?.cta?.label?.trim() || "Discover";

  const items = useMemo(() => {
    const products = Array.isArray(featuredProductsData?.products)
      ? featuredProductsData.products
      : [];

    const mapped: FeaturedCarouselItem[] = products
      .map((product, index) => {
        const name = product?.name?.trim() ?? "";
        const cmsImage = resolveCmsMediaUrl(product?.image);
        const image =
          cmsImage ||
          featuredProductsCarouselFallbackImages[
            index % featuredProductsCarouselFallbackImages.length
          ];

        return {
          id: product?.id ?? index,
          name,
          price: typeof product?.price === "number" ? product.price : null,
          image,
          href: product?.id ? `/product/${product.id}` : "/products",
        };
      })
      .filter((product) => Boolean(product.name));

    return normalizeCarouselItems(mapped);
  }, [featuredProductsData?.products]);

  if (isShoppingLoading) {
    return (
      <section
        id={id}
        className="overflow-visible px-4 py-16 md:px-40 md:py-104"
        aria-label="Featured diamond carousel"
        aria-busy="true"
      >
        <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-10 overflow-visible">
          <div className="flex w-full flex-col items-center gap-4 text-center">
            <div className="h-[35px] w-[283px] animate-pulse rounded bg-gray200 md:h-[53px] md:w-[424px]" aria-hidden />
            <div className="h-[36px] w-[306px] animate-pulse rounded bg-gray200 md:h-[22px] md:w-[517px]" aria-hidden />
          </div>
          <div className="relative h-[303px] w-full md:h-[411px]">
            <div className="absolute left-1/2 top-0 h-[170px] w-[260px] -translate-x-1/2 animate-pulse rounded bg-gray200 md:h-[259px] md:w-[600px]" aria-hidden />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className="overflow-visible px-0 py-16 md:px-40 md:py-104"
      aria-label="Featured diamond carousel"
    >
      <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-10 overflow-visible">
        <FeaturedProductsHeader title={sectionTitle} description={description} />
        <FeaturedProductsCarousel
          items={items}
          ctaLabel={ctaLabel}
          sectionLabel={sectionTitle}
        />
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
