import type { StaticImageData } from "next/image";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import {
  ALANKARA_PRODUCT_COUNT,
  ALANKARA_THUMBNAIL_CROPS,
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
  collectionDesktopAlt: string;
  collectionMobileAlt: string;
  collectionCta?: { label: string; href: string };
  products: AlankaraCollectionProduct[];
  /** Ordered Magento SKUs from CMS (empty when not configured). */
  productSkus: string[];
  featuredProductSku?: string;
  defaultActiveIndex: number;
  productCtaLabel?: string;
};

const THUMBNAIL_CROPS = [
  ALANKARA_THUMBNAIL_CROPS.first,
  ALANKARA_THUMBNAIL_CROPS.second,
  ALANKARA_THUMBNAIL_CROPS.third,
  ALANKARA_THUMBNAIL_CROPS.fourth,
  ALANKARA_THUMBNAIL_CROPS.fifth,
] as const;

function getThumbnailCrop(index: number) {
  return THUMBNAIL_CROPS[index % THUMBNAIL_CROPS.length];
}

function buildCmsProduct(
  index: number,
  cmsProduct: FeaturedCollectionImage,
  ctaLabel?: string,
): AlankaraCollectionProduct | null {
  const productId =
    cmsProduct?.id != null && String(cmsProduct.id).trim() !== ""
      ? String(cmsProduct.id)
      : null;
  const name = cmsProduct?.name?.trim();
  const cmsImage = cmsProduct?.image ? resolveCmsMediaUrl(cmsProduct.image) : "";

  if (!name || !cmsImage) {
    return null;
  }

  const crop = getThumbnailCrop(index);

  return {
    id: productId ?? `alankara-cms-${index}`,
    name,
    image: cmsImage,
    thumbnailImage: cmsImage,
    thumbnailCrop: crop,
    desktopCrop: crop,
    href: productId ? `/product/${productId}` : "",
    ...(ctaLabel ? { ctaLabel } : {}),
  };
}

function resolveLegacyCmsProducts(
  cmsProducts: FeaturedCollectionImage[] | null | undefined,
  ctaLabel?: string,
): AlankaraCollectionProduct[] {
  return (Array.isArray(cmsProducts) ? cmsProducts : [])
    .map((product, index) => buildCmsProduct(index, product, ctaLabel))
    .filter((product): product is AlankaraCollectionProduct => product !== null && Boolean(product.href))
    .slice(0, ALANKARA_PRODUCT_COUNT);
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

function resolveAlankaraMagentoProductImage(
  product: JewelleryListingProduct,
): string | null {
  for (const candidate of [product.primaryImage, product.modalImage, product.hoverImage]) {
    const src = candidate ? getImageSrc(candidate) : "";
    if (src) {
      return src;
    }
  }

  return null;
}

export function mapMagentoProductsToAlankaraCollection(
  magentoProducts: JewelleryListingProduct[],
  orderedSkus: string[],
  options?: { featuredProductSku?: string; ctaLabel?: string },
): { products: AlankaraCollectionProduct[]; defaultActiveIndex: number } {
  const bySku = new Map(
    magentoProducts.map((product) => [product.sku.trim(), product] as const),
  );

  const ctaLabel = options?.ctaLabel?.trim();
  const mappedProducts: AlankaraCollectionProduct[] = [];

  for (const sku of orderedSkus) {
    const magento = bySku.get(sku);
    if (!magento) continue;

    const image = resolveAlankaraMagentoProductImage(magento);
    if (!image) continue;

    const index = mappedProducts.length;
    const crop = getThumbnailCrop(index);

    mappedProducts.push({
      id: magento.sku,
      name: magento.name,
      image,
      thumbnailImage: image,
      thumbnailCrop: crop,
      desktopCrop: crop,
      href: `/product/${magento.urlKey}`,
      ...(ctaLabel ? { ctaLabel } : {}),
    });

    if (mappedProducts.length >= ALANKARA_PRODUCT_COUNT) break;
  }

  const featuredSku = options?.featuredProductSku?.trim();
  let defaultActiveIndex = 0;
  if (featuredSku && mappedProducts.length > 0) {
    const featuredIndex = mappedProducts.findIndex((item) => String(item.id) === featuredSku);
    defaultActiveIndex = featuredIndex >= 0 ? featuredIndex : 0;
  }

  return { products: mappedProducts, defaultActiveIndex };
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

  const ctaUrl = section?.cta?.url ?? section?.cta?.to ?? "";
  const ctaLabel = section?.cta?.label ?? section?.label?.label ?? "";
  const productCtaLabel = section?.label?.label?.trim() || section?.cta?.label?.trim() || undefined;

  const legacyProducts =
    productSkus.length === 0
      ? resolveLegacyCmsProducts(section?.products, productCtaLabel)
      : [];

  const desktopCollectionImage = collectionImages.desktopUrl || collectionImages.mobileUrl || "";
  const mobileCollectionImage = collectionImages.mobileUrl || collectionImages.desktopUrl || "";

  return {
    isActive: section?.isActive,
    title: section?.sectionTitle?.trim() || "",
    description: descriptionOverride || section?.description?.trim() || "",
    collectionImage: desktopCollectionImage,
    collectionImageMobile: mobileCollectionImage,
    collectionDesktopAlt: collectionImages.desktopAlt,
    collectionMobileAlt: collectionImages.mobileAlt,
    collectionCta:
      ctaUrl && ctaLabel
        ? {
            label: ctaLabel.trim(),
            href: ctaUrl,
          }
        : undefined,
    products: legacyProducts,
    productSkus,
    featuredProductSku,
    defaultActiveIndex: 0,
    productCtaLabel,
  };
}
