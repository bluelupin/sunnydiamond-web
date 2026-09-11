import type { StaticImageData } from "next/image";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import {
  ALANKARA_PRODUCT_COUNT,
  ALANKARA_THUMBNAIL_CROPS,
  type AlankaraCollectionProduct,
} from "@/shared/ui/collection/alankaraCollection.types";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import { getImageSrc } from "@/shared/utils/image";
import { buildJewelleryCollectionHref } from "@/features/jewellery-product/utils/collectionListing";
import type { FeaturedCollectionSection } from "@/types/homepage/categoryNavigation";

const DEFAULT_COLLECTION_CTA_LABEL = "VIEW COLLECTION";

export type ResolvedAlankaraCollectionSection = {
  isActive?: boolean | null;
  title: string;
  description: string;
  collectionImage: string | StaticImageData;
  collectionImageMobile: string | StaticImageData;
  collectionDesktopAlt: string;
  collectionMobileAlt: string;
  collectionCta?: { label: string; href: string };
  /** Strapi collection slug used to match Magento `sd_collection`. */
  magentoCollectionSlug?: string;
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

export function mapMagentoProductsToAlankaraCollectionList(
  magentoProducts: JewelleryListingProduct[],
  options?: { ctaLabel?: string },
): AlankaraCollectionProduct[] {
  const ctaLabel = options?.ctaLabel?.trim();
  const mappedProducts: AlankaraCollectionProduct[] = [];

  for (const magento of magentoProducts) {
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

  return mappedProducts;
}

export function resolveAlankaraCollectionSection(
  section: FeaturedCollectionSection | null | undefined,
  options?: { descriptionOverride?: string },
): ResolvedAlankaraCollectionSection {
  const descriptionOverride = options?.descriptionOverride?.trim();
  const magentoCollectionSlug = section?.slug?.trim() || undefined;

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
  const resolvedCollectionCta = magentoCollectionSlug
    ? {
        label: ctaLabel.trim() || DEFAULT_COLLECTION_CTA_LABEL,
        href: buildJewelleryCollectionHref(magentoCollectionSlug),
      }
    : ctaUrl && ctaLabel
      ? {
          label: ctaLabel.trim(),
          href: ctaUrl,
        }
      : undefined;

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
    collectionCta: resolvedCollectionCta,
    magentoCollectionSlug,
    defaultActiveIndex: 0,
    productCtaLabel,
  };
}
