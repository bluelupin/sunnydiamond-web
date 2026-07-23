import type { Product } from "@/features/products/data/products";
import type {
  MagentoCustomAttributeItem,
  MagentoProductDetailItem,
} from "./magentoProduct.types";
import { buildProductSeo } from "@/shared/lib/seo/productSeo";
import { resolveMagentoProductImages } from "./products.mapper";
import { resolveMagentoProductPricing } from "./productPricing.utils";
import { mapMagentoProductEngraving } from "./productEngraving.mapper";
import type { MagentoEngravingFontOption } from "./engravingFonts.service";

function stripHtml(html?: string | null): string {
  if (!html) {
    return "";
  }

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getAttributeMap(items: MagentoCustomAttributeItem[] | null | undefined) {
  const map = new Map<string, MagentoCustomAttributeItem>();

  for (const item of items ?? []) {
    const code = item.code?.trim();
    if (code) {
      map.set(code, item);
    }
  }

  return map;
}

function getAttributeValue(
  attributes: Map<string, MagentoCustomAttributeItem>,
  code: string,
): string | null {
  const item = attributes.get(code);
  const selected = item?.selected_options?.[0]?.label?.trim();
  if (selected) {
    return selected;
  }

  const value = item?.value?.trim();
  return value || null;
}

function formatMetalColorLabel(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCaratLabel(value: string | null): string {
  if (!value) {
    return "Diamond";
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "Diamond";
  }

  const formatted = numeric.toFixed(3).replace(/\.?0+$/, "");
  return `${formatted} ct Diamond`;
}

function buildGalleryImages(product: MagentoProductDetailItem): string[] {
  const { primaryImage, lifestyleImage } = resolveMagentoProductImages(
    product.media_gallery,
    product.image?.url,
    product.model_wear_image,
  );
  const urls = (product.media_gallery ?? [])
    .filter((item) => item?.url && !item.disabled)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((item) => item.url!.trim());

  const unique = Array.from(new Set([primaryImage, lifestyleImage, ...urls].filter(Boolean)));
  return unique.length > 0 ? unique : primaryImage ? [primaryImage] : [];
}

function resolveProductCategory(categories: MagentoProductDetailItem["categories"]): string {
  const jewelleryCategory = (categories ?? []).find((category) =>
    category.url_key?.startsWith("diamond-"),
  );

  return jewelleryCategory?.name?.trim() || categories?.[0]?.name?.trim() || "Jewellery";
}

export function mapMagentoProductDetailToProduct(
  product: MagentoProductDetailItem,
  options?: { engravingFontOptions?: MagentoEngravingFontOption[] },
): Product | null {
  const sku = product.sku?.trim();
  const name = product.name?.trim();
  const urlKey = product.url_key?.trim();
  const pricing = resolveMagentoProductPricing(product);

  if (!sku || !name || !urlKey || !pricing) {
    return null;
  }

  const attributes = getAttributeMap(product.custom_attributesV2?.items);
  const clarity = getAttributeValue(attributes, "sd_diamond_clarity");
  const metalPurity = getAttributeValue(attributes, "sd_metal_purity");
  const metalColor = formatMetalColorLabel(getAttributeValue(attributes, "sd_metal_color"));
  const caratRaw = getAttributeValue(attributes, "sd_diamond_carat");
  const carat = formatCaratLabel(caratRaw);
  const ratingRaw = getAttributeValue(attributes, "sd_rating");
  const rating = ratingRaw ? Number(ratingRaw) : 0;

  const metal = [metalPurity, metalColor].filter(Boolean).join(" ") || "Gold";
  const { lifestyleImage } = resolveMagentoProductImages(
    product.media_gallery,
    product.image?.url,
    product.model_wear_image,
  );
  const images = buildGalleryImages(product);
  const primaryImage = images[0] ?? product.image?.url?.trim() ?? "";

  if (!primaryImage) {
    return null;
  }

  const detailAttributes = [
    clarity ? `${clarity} Grade` : null,
    metalPurity ? `${metalPurity} Metal` : metal,
    carat,
  ].filter((attribute): attribute is string => Boolean(attribute));

  const shortDescription = stripHtml(product.short_description?.html) || name;
  const engraving = mapMagentoProductEngraving(product.custom_attributesV2?.items, {
    fontMetadataOptions: options?.engravingFontOptions ?? [],
    mediaGallery: product.media_gallery,
    referenceImageUrl: product.image?.url,
  });

  return {
    id: sku,
    urlKey,
    name,
    price: pricing.price,
    originalPrice: pricing.originalPrice,
    description: stripHtml(product.description?.html) || name,
    shortDescription,
    category: resolveProductCategory(product.categories),
    image: primaryImage,
    images,
    lifestyleImage: lifestyleImage || primaryImage,
    carat,
    metal,
    inStock: product.stock_status === "IN_STOCK",
    featured: false,
    rating: Number.isFinite(rating) ? rating : 0,
    reviews: 0,
    detailAttributes,
    engraving,
    seo: buildProductSeo({
      name,
      urlKey,
      shortDescription,
      metaTitle: product.meta_title,
      metaDescription: product.meta_description,
      metaKeywords: product.meta_keyword,
      canonicalUrl: product.canonical_url,
    }),
  };
}
