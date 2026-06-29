import { homeContent } from "@/features/cms/data/content";
import { products } from "@/features/products/data/products";
import {
  ALANKARA_FALLBACK_PRODUCTS,
  ALANKARA_FALLBACKS,
  ALANKARA_PRODUCT_COUNT,
  type AlankaraCollectionProduct,
} from "@/shared/ui/collection/alankaraCollection.types";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import type {
  FeaturedCollectionImage,
  FeaturedCollectionSection,
} from "@/types/homepage/categoryNavigation";

export type ResolvedAlankaraCollectionSection = {
  isActive?: boolean | null;
  title: string;
  description: string;
  collectionImage: string;
  collectionImageMobile: string;
  collectionCta?: { label: string; href: string };
  products: AlankaraCollectionProduct[];
};

const COLLECTION_FALLBACK = homeContent.alankara.collection;

function getFallbackThumbnailCrop(index: number) {
  return ALANKARA_FALLBACK_PRODUCTS[index % ALANKARA_FALLBACK_PRODUCTS.length];
}

function buildFallbackProduct(index: number, productId: string): AlankaraCollectionProduct {
  const catalogProduct = products.find((item) => item.id === productId);
  const figmaFallback = getFallbackThumbnailCrop(index);

  return {
    id: productId,
    name: catalogProduct?.name || figmaFallback.name,
    image: figmaFallback.image,
    thumbnailImage: figmaFallback.image,
    thumbnailCrop: figmaFallback.thumbnailCrop,
    desktopCrop: figmaFallback.desktopCrop,
    href: `/product/${productId}`,
    ctaLabel: homeContent.alankara.product.cta.label,
  };
}

function getCatalogFallbackProducts(): AlankaraCollectionProduct[] {
  return homeContent.alankara.productIds
    .slice(0, ALANKARA_PRODUCT_COUNT)
    .map((productId, index) => buildFallbackProduct(index, productId));
}

function buildCmsProduct(
  index: number,
  cmsProduct: FeaturedCollectionImage,
): AlankaraCollectionProduct | null {
  const productId =
    cmsProduct?.id != null && String(cmsProduct.id).trim() !== ""
      ? String(cmsProduct.id)
      : null;
  const name = cmsProduct?.name?.trim();
  if (!name && !productId) {
    return null;
  }

  const catalogProduct = productId
    ? products.find((item) => item.id === productId)
    : undefined;
  const figmaFallback = getFallbackThumbnailCrop(index);
  const cmsImage = cmsProduct?.image ? resolveCmsMediaUrl(cmsProduct.image) : "";
  const image = cmsImage || figmaFallback.image;

  return {
    id: productId ?? `alankara-cms-${index}`,
    name: name || catalogProduct?.name || figmaFallback.name,
    image,
    thumbnailImage: cmsImage || figmaFallback.image,
    thumbnailCrop: figmaFallback.thumbnailCrop,
    desktopCrop: figmaFallback.desktopCrop,
    href: productId ? `/product/${productId}` : "/products",
    ctaLabel: homeContent.alankara.product.cta.label,
  };
}

function resolveAlankaraProducts(
  cmsProducts: FeaturedCollectionImage[] | null | undefined,
): AlankaraCollectionProduct[] {
  const cmsMapped = (Array.isArray(cmsProducts) ? cmsProducts : [])
    .map((product, index) => buildCmsProduct(index, product))
    .filter((product): product is AlankaraCollectionProduct => product !== null);

  if (cmsMapped.length === 0) {
    return getCatalogFallbackProducts();
  }

  if (cmsMapped.length >= ALANKARA_PRODUCT_COUNT) {
    return cmsMapped.slice(0, ALANKARA_PRODUCT_COUNT);
  }

  const merged = [...cmsMapped];
  for (const fallback of getCatalogFallbackProducts()) {
    if (merged.length >= ALANKARA_PRODUCT_COUNT) break;
    if (!merged.some((item) => String(item.id) === String(fallback.id))) {
      merged.push(fallback);
    }
  }

  return merged.slice(0, ALANKARA_PRODUCT_COUNT);
}

export function resolveAlankaraCollectionSection(
  section: FeaturedCollectionSection | null | undefined,
  options?: { descriptionOverride?: string },
): ResolvedAlankaraCollectionSection {
  const descriptionOverride = options?.descriptionOverride?.trim();

  const media =
    (section as { primaryImage?: unknown; image?: unknown } | null | undefined)?.primaryImage ??
    section?.backgroundImage ??
    (section as { image?: unknown } | null | undefined)?.image;
  const collectionImages = resolveResponsiveCmsImage(
    media as Parameters<typeof resolveResponsiveCmsImage>[0],
  );

  const ctaUrl =
    section?.cta?.url ?? section?.cta?.to ?? COLLECTION_FALLBACK.cta.to;
  const ctaLabel =
    section?.cta?.label ?? section?.label?.label ?? COLLECTION_FALLBACK.cta.label;

  return {
    isActive: section?.isActive,
    title: section?.sectionTitle?.trim() || COLLECTION_FALLBACK.title,
    description:
      descriptionOverride ||
      section?.description?.trim() ||
      COLLECTION_FALLBACK.description,
    collectionImage: collectionImages.desktopUrl || ALANKARA_FALLBACKS.heroDesktop,
    collectionImageMobile: collectionImages.mobileUrl || ALANKARA_FALLBACKS.heroMobile,
    collectionCta: ctaUrl
      ? {
          label: ctaLabel,
          href: ctaUrl,
        }
      : undefined,
    products: resolveAlankaraProducts(section?.products),
  };
}
