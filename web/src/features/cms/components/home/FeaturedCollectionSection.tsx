"use client";

import { useMemo } from "react";
import { homeContent } from "@/features/cms/data/content";
import { products } from "@/features/products/data/products";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { AlankaraCollection } from "@/shared/ui/collection/AlankaraCollection";
import {
  ALANKARA_FALLBACKS,
  ALANKARA_THUMBNAIL_CROPS,
  type AlankaraCollectionProduct,
} from "@/shared/ui/collection/alankaraCollection.types";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import type { FeaturedCollectionImage } from "@/types/homepage/categoryNavigation";

interface FeaturedCollectionSectionProps {
  id?: string;
}

function resolveAlankaraProduct(index: number, product?: (typeof products)[number]) {
  if (index === 0) {
    return {
      image: ALANKARA_FALLBACKS.firstThumbnail,
      thumbnailCrop: ALANKARA_THUMBNAIL_CROPS.first,
    };
  }

  if (index === 1) {
    return {
      image: ALANKARA_FALLBACKS.secondThumbnail,
      thumbnailCrop: ALANKARA_THUMBNAIL_CROPS.second,
    };
  }

  return {
    image: product?.image ?? ALANKARA_FALLBACKS.product,
  };
}

function getFallbackProducts(): AlankaraCollectionProduct[] {
  return homeContent.alankara.productIds.map((productId, index) => {
    const product = products.find((item) => item.id === productId);
    const resolved = resolveAlankaraProduct(index, product);

    return {
      id: productId,
      name: product?.name ?? "Saptam Diamond Ring",
      image: resolved.image,
      thumbnailCrop: resolved.thumbnailCrop,
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
      .map((product: FeaturedCollectionImage, index: number) => {
        const resolved =
          index === 0 || index === 1
            ? resolveAlankaraProduct(index)
            : {
                image: resolveCmsMediaUrl(product.image) || ALANKARA_FALLBACKS.product,
              };

        return {
          id: product.id ?? product.name ?? "",
          name: product.name?.trim() ?? "",
          image: resolved.image,
          thumbnailCrop: resolved.thumbnailCrop,
          href: `/product/${product.id ?? ""}`,
          ctaLabel: ctaLabel === fallback.cta.label ? "Shop Now" : ctaLabel,
        };
      })
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
      defaultProductCtaLabel="Shop Now"
      {...collectionProps}
    />
  );
};

export default FeaturedCollectionSection;
