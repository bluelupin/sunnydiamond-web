"use client";

import { useMemo } from "react";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { homeContent } from "@/features/cms/data/content";
import { products } from "@/features/products/data/products";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { AlankaraCollection } from "@/shared/ui/collection/AlankaraCollection";
import {
  ALANKARA_FALLBACKS,
  type AlankaraCollectionProduct,
} from "@/shared/ui/collection/alankaraCollection.types";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import type { FeaturedCollectionImage } from "@/types/homepage/categoryNavigation";

interface FeaturedCollectionSectionProps {
  id?: string;
}

function getFallbackProducts(): AlankaraCollectionProduct[] {
  return homeContent.alankara.productIds.map((productId) => {
    const product = products.find((item) => item.id === productId);

    return {
      id: productId,
      name: product?.name ?? "Saptam Diamond Ring",
      image: product?.image ?? ALANKARA_FALLBACKS.product,
      href: `/product/${productId}`,
      ctaLabel: homeContent.alankara.product.cta.label,
    };
  });
}

const FeaturedCollectionSection = ({ id }: FeaturedCollectionSectionProps) => {
  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();
  const featuredCollectionData =
    shoppingData?.homepage?.featuredCollectionSection || shoppingData?.featuredCollectionSection;

  const fallback = homeContent.alankara.collection;
  const ref = useFadeIn();

  const collectionProps = useMemo(() => {
    const sectionTitle = featuredCollectionData?.sectionTitle?.trim() || fallback.title;
    const description = featuredCollectionData?.description?.trim() || fallback.description;
    const ctaUrl =
      featuredCollectionData?.cta?.url ??
      featuredCollectionData?.cta?.to ??
      fallback.cta.to;
    const ctaLabel =
      featuredCollectionData?.cta?.label ??
      featuredCollectionData?.label?.label ??
      fallback.cta.label;

    const media =
      (featuredCollectionData as { primaryImage?: unknown; image?: unknown })?.primaryImage ??
      featuredCollectionData?.backgroundImage ??
      (featuredCollectionData as { image?: unknown })?.image;
    const collectionImages = resolveResponsiveCmsImage(
      media as Parameters<typeof resolveResponsiveCmsImage>[0],
    );

    const cmsProducts = Array.isArray(featuredCollectionData?.products)
      ? featuredCollectionData.products
      : [];

    const mappedProducts: AlankaraCollectionProduct[] = cmsProducts
      .map((product: FeaturedCollectionImage) => ({
        id: product.id ?? product.name ?? "",
        name: product.name?.trim() ?? "",
        image: resolveCmsMediaUrl(product.image) || ALANKARA_FALLBACKS.product,
        href: `/product/${product.id ?? ""}`,
        ctaLabel: ctaLabel === fallback.cta.label ? "Shop Now" : ctaLabel,
      }))
      .filter((product) => Boolean(product.id) && Boolean(product.name));

    return {
      title: sectionTitle,
      description,
      collectionImage: collectionImages.desktopUrl || ALANKARA_FALLBACKS.heroDesktop,
      collectionImageMobile: collectionImages.mobileUrl || ALANKARA_FALLBACKS.heroMobile,
      collectionCta: ctaUrl
        ? {
            label: ctaLabel,
            href: ctaUrl,
          }
        : undefined,
      products: mappedProducts.length ? mappedProducts : getFallbackProducts(),
    };
  }, [featuredCollectionData, fallback]);

  if (isShoppingLoading) {
    return (
      <section
        id={id}
        ref={ref}
        aria-label="Alankara Collection"
        className="bg-white"
        aria-busy="true"
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-2">
          <div className="h-[540px] bg-gray200 lg:h-[800px]" />
          <div className="hidden h-[800px] bg-gray200/80 lg:block" />
        </div>
      </section>
    );
  }

  return (
    <AlankaraCollection
      id={id}
      priority
      defaultProductCtaLabel="Shop Now"
      {...collectionProps}
    />
  );
};

export default FeaturedCollectionSection;
