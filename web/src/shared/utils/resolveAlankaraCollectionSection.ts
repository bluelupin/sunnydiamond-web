import type { StaticImageData } from "next/image";
import fallBackImage from "@/assets/fallBackImage.png";
import { homeContent } from "@/features/cms/data/content";
import { products } from "@/features/products/data/products";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import {
  ALANKARA_FALLBACK_PRODUCTS,
  ALANKARA_DEFAULT_ACTIVE_INDEX,
  ALANKARA_PRODUCT_COUNT,
  type AlankaraCollectionProduct,
} from "@/shared/ui/collection/alankaraCollection.types";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import { getImageSrc } from "@/shared/utils/image";
import type {
  FeaturedCollectionImage,
  FeaturedCollectionSection,
} from "@/types/homepage/categoryNavigation";

export type ResolvedAlankaraCollectionSection = {
  isActive?: boolean | null;
  title: string;
  description: string;
  collectionImage: string | StaticImageData;
  collectionImageMobile: string | StaticImageData;
  collectionCta?: { label: string; href: string };
  products: AlankaraCollectionProduct[];
  /** Ordered Magento SKUs from CMS (empty when not configured). */
  productSkus: string[];
  featuredProductSku?: string;
  defaultActiveIndex: number;
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
    image: fallBackImage,
    thumbnailImage: fallBackImage,
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

  return {
    id: productId ?? `alankara-cms-${index}`,
    name: name || catalogProduct?.name || figmaFallback.name,
    image: cmsImage || fallBackImage,
    thumbnailImage: cmsImage || fallBackImage,
    thumbnailCrop: figmaFallback.thumbnailCrop,
    desktopCrop: figmaFallback.desktopCrop,
    href: productId ? `/product/${productId}` : "/jewellery",
    ctaLabel: homeContent.alankara.product.cta.label,
  };
}

function resolveLegacyCmsProducts(
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

/** Normalize CMS SKU list: productSkus order, featured first, deduped. */
export function resolveAlankaraProductSkus(
  section: FeaturedCollectionSection | null | undefined,
): { productSkus: string[]; featuredProductSku?: string } {
  const featuredProductSku = section?.featuredProductSku?.trim() || undefined;
  const fromList = (section?.productSkus ?? [])
    .map((sku) => sku.trim())
    .filter(Boolean);

  const ordered: string[] = [];
  const seen = new Set<string>();

  const push = (sku?: string) => {
    if (!sku || seen.has(sku)) return;
    seen.add(sku);
    ordered.push(sku);
  };

  push(featuredProductSku);
  for (const sku of fromList) {
    push(sku);
  }

  return { productSkus: ordered, featuredProductSku };
}

const placeholderImageSrc = getImageSrc(fallBackImage);

function isGenericPlaceholderImage(source: string | StaticImageData | null | undefined): boolean {
  if (!source || source === fallBackImage) {
    return true;
  }

  const src = getImageSrc(source);
  return !src || src === placeholderImageSrc;
}

/** Magento catalog photo first; occasions placeholder only when Magento has none. */
function resolveAlankaraMagentoProductImage(
  product: JewelleryListingProduct,
): string | StaticImageData {
  for (const candidate of [product.primaryImage, product.modalImage, product.hoverImage]) {
    if (!candidate || isGenericPlaceholderImage(candidate)) {
      continue;
    }
    return candidate;
  }

  return fallBackImage;
}

export function mapMagentoProductsToAlankaraCollection(
  magentoProducts: JewelleryListingProduct[],
  orderedSkus: string[],
  options?: { featuredProductSku?: string; ctaLabel?: string },
): { products: AlankaraCollectionProduct[]; defaultActiveIndex: number } {
  const bySku = new Map(
    magentoProducts.map((product) => [product.sku.trim(), product] as const),
  );

  const ctaLabel = options?.ctaLabel ?? homeContent.alankara.product.cta.label;
  const products: AlankaraCollectionProduct[] = [];

  for (const sku of orderedSkus) {
    const magento = bySku.get(sku);
    if (!magento) continue;

    const index = products.length;
    const figmaFallback = getFallbackThumbnailCrop(index);
    const image = resolveAlankaraMagentoProductImage(magento);

    products.push({
      id: magento.sku,
      name: magento.name,
      image,
      thumbnailImage: image,
      thumbnailCrop: figmaFallback.thumbnailCrop,
      desktopCrop: figmaFallback.desktopCrop,
      href: `/product/${magento.urlKey}`,
      ctaLabel,
    });

    if (products.length >= ALANKARA_PRODUCT_COUNT) break;
  }

  const featuredSku = options?.featuredProductSku?.trim();
  let defaultActiveIndex = ALANKARA_DEFAULT_ACTIVE_INDEX;
  if (featuredSku && products.length > 0) {
    const featuredIndex = products.findIndex((item) => String(item.id) === featuredSku);
    defaultActiveIndex =
      featuredIndex >= 0
        ? featuredIndex
        : Math.min(ALANKARA_DEFAULT_ACTIVE_INDEX, products.length - 1);
  } else if (products.length > 0) {
    defaultActiveIndex = Math.min(ALANKARA_DEFAULT_ACTIVE_INDEX, products.length - 1);
  }

  return { products, defaultActiveIndex };
}

export function resolveAlankaraCollectionSection(
  section: FeaturedCollectionSection | null | undefined,
  options?: { descriptionOverride?: string },
): ResolvedAlankaraCollectionSection {
  const descriptionOverride = options?.descriptionOverride?.trim();
  const { productSkus, featuredProductSku } = resolveAlankaraProductSkus(section);

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

  // Prefer Magento SKU path; until Magento resolves, keep legacy/static product cards.
  const fallbackProducts =
    productSkus.length > 0
      ? getCatalogFallbackProducts()
      : resolveLegacyCmsProducts(section?.products);

  return {
    isActive: section?.isActive,
    title: section?.sectionTitle?.trim() || COLLECTION_FALLBACK.title,
    description:
      descriptionOverride ||
      section?.description?.trim() ||
      COLLECTION_FALLBACK.description,
    collectionImage: collectionImages.desktopUrl || fallBackImage,
    collectionImageMobile: collectionImages.mobileUrl || fallBackImage,
    collectionCta: ctaUrl
      ? {
          label: ctaLabel,
          href: ctaUrl,
        }
      : undefined,
    products: fallbackProducts,
    productSkus,
    featuredProductSku,
    defaultActiveIndex: Math.min(
      ALANKARA_DEFAULT_ACTIVE_INDEX,
      Math.max(0, fallbackProducts.length - 1),
    ),
  };
}
