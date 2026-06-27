"use client";

import { useMemo } from "react";
import { homeContent } from "@/features/cms/data/content";
import { products } from "@/features/products/data/products";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { AlankaraCollection } from "@/shared/ui/collection/AlankaraCollection";
import {
  ALANKARA_FALLBACK_PRODUCTS,
  ALANKARA_FALLBACKS,
  ALANKARA_PRODUCT_COUNT,
  type AlankaraCollectionProduct,
} from "@/shared/ui/collection/alankaraCollection.types";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import type { FeaturedCollectionImage } from "@/types/homepage/categoryNavigation";

interface FeaturedCollectionSectionProps {
  id?: string;
  sectionHeading?: string;
  description?: string;
}

function buildAlankaraProduct(
  index: number,
  productId: string,
  cmsProduct?: FeaturedCollectionImage,
): AlankaraCollectionProduct {
  const catalogProduct = products.find((item) => item.id === productId);
  const figmaFallback = ALANKARA_FALLBACK_PRODUCTS[index];

  const cmsImage = cmsProduct?.image ? resolveCmsMediaUrl(cmsProduct.image) : "";
  const image = cmsImage || figmaFallback.image;

  return {
    id: productId,
    name: cmsProduct?.name?.trim() || catalogProduct?.name || figmaFallback.name,
    image,
    thumbnailImage: figmaFallback.image,
    thumbnailCrop: figmaFallback.thumbnailCrop,
    desktopCrop: figmaFallback.desktopCrop,
    href: `/product/${productId}`,
    ctaLabel: homeContent.alankara.product.cta.label,
  };
}

function getFallbackProducts(): AlankaraCollectionProduct[] {
  return homeContent.alankara.productIds.map((productId, index) =>
    buildAlankaraProduct(index, productId),
  );
}

const FeaturedCollectionSection = ({ id, sectionHeading, description: descriptionProp }: FeaturedCollectionSectionProps) => {
  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();
  const featuredCollectionData =
    shoppingData?.homepage?.featuredCollectionSection || shoppingData?.featuredCollectionSection;

  const fallback = homeContent.alankara.collection;

  const collectionProps = useMemo(() => {
    const sectionTitle = featuredCollectionData?.sectionTitle?.trim() || fallback.title;
    const description =
      descriptionProp?.trim() ||
      featuredCollectionData?.description?.trim() ||
      fallback.description;
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

    const productIds = homeContent.alankara.productIds.slice(0, ALANKARA_PRODUCT_COUNT);
    const mappedProducts: AlankaraCollectionProduct[] = productIds.map((productId, index) => {
      const cmsProduct = cmsProducts[index] as FeaturedCollectionImage | undefined;
      return buildAlankaraProduct(index, productId, cmsProduct);
    });

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
  }, [descriptionProp, featuredCollectionData, fallback]);

  if (isShoppingLoading) {
    return (
      <section
        id={id}
        aria-label="Alankara Collection"
        className="bg-white min-[1920px]:relative min-[1920px]:left-1/2 min-[1920px]:w-screen min-[1920px]:max-w-none min-[1920px]:-translate-x-1/2"
        aria-busy="true"
      >
        {sectionHeading ? (
          <div className="mx-auto w-full max-w-1440 px-4 pt-16 lg:px-8 lg:pt-104">
            <h2 className="mb-40 text-center font-larken text-32 font-light leading-110 text-darkblack lg:text-left lg:text-48">
              {sectionHeading}
            </h2>
          </div>
        ) : null}
        <div className="mx-auto grid w-full max-w-1440 grid-cols-1 lg:grid-cols-2 min-[1920px]:mx-0 min-[1920px]:!max-w-none min-[1920px]:w-full">
          <div className="h-[540px] bg-gray200 lg:h-[800px]" />
          <div className="hidden h-[800px] bg-gray200/80 lg:block" />
        </div>
      </section>
    );
  }

  return (
    <AlankaraCollection
      id={id}
      sectionHeading={sectionHeading}
      defaultProductCtaLabel="Shop Now"
      {...collectionProps}
    />
  );
};

export default FeaturedCollectionSection;
