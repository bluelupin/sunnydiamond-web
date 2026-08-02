import type { Product, ProductConfigurable } from "@/features/products/data/products";
import type {
  MagentoConfigurableOptionValue,
  MagentoConfigurableVariant,
  MagentoCustomAttributeItem,
  MagentoProductDetailItem,
} from "./magentoProduct.types";
import { buildProductSeo } from "@/shared/lib/seo/productSeo";
import { getMagentoGraphqlUrl } from "@/services/magento/config";
import {
  getMagentoCustomAttributeValue,
  isMagentoPlaceholderImage,
  resolveMagentoModelWearImageUrl,
} from "./magentoAttribute.utils";
import { resolveMagentoProductImages } from "./products.mapper";
import { resolveMagentoProductPricing } from "./productPricing.utils";
import { mapMagentoProductEngraving } from "./productEngraving.mapper";
import { mapMagentoProductCustomOptions } from "./productCustomOptions.mapper";
import { formatMetalColorLabel } from "@/features/products/utils/metalColorOptions.utils";
import type { MagentoEngravingFontOption } from "./engravingFonts.service";
import { MAGENTO_URL_KEY_TO_SLUG } from "@/features/jewellery-product/utils/jewelleryRoutes";
import fallBackImage from "@/assets/fallBackImage.png";
import { getImageSrc } from "@/shared/utils/image";

function stripHtml(html?: string | null): string {
  if (!html) {
    return "";
  }

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Magento attribute codes → PDP accordion sections. */
const PDP_DETAIL_SECTION_ATTRIBUTE_CODES = {
  specifications: "product_specification",
  qualityCertifications: "quality_certificate",
  shippingPolicies: "shipping_policies",
  careMaintenance: "care_maintenance",
  manufacturedBy: "manufactured_by",
} as const;

const CONFIGURABLE_METAL_ATTRIBUTE_CODE = "sd_metal_color";

function mapMagentoProductDetailSections(
  items: MagentoCustomAttributeItem[] | null | undefined,
): Product["detailSections"] | undefined {
  const sections: NonNullable<Product["detailSections"]> = {};

  for (const [key, code] of Object.entries(PDP_DETAIL_SECTION_ATTRIBUTE_CODES) as Array<
    [keyof NonNullable<Product["detailSections"]>, string]
  >) {
    const value = stripHtml(getMagentoCustomAttributeValue(items, code));
    if (value) {
      sections[key] = value;
    }
  }

  return Object.keys(sections).length > 0 ? sections : undefined;
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

function buildGalleryImages(
  product: Pick<MagentoProductDetailItem, "media_gallery" | "image" | "model_wear_image">,
): string[] {
  const { primaryImage, lifestyleImage } = resolveMagentoProductImages(
    product.media_gallery,
    product.image?.url,
    product.model_wear_image,
  );
  const urls = (product.media_gallery ?? [])
    .filter((item) => item?.url && !item.disabled && !isMagentoPlaceholderImage(item.url))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((item) => item.url!.trim());

  const unique = Array.from(
    new Set(
      [primaryImage, lifestyleImage, ...urls].filter(
        (url): url is string => Boolean(url) && !isMagentoPlaceholderImage(url),
      ),
    ),
  );
  return unique;
}

function pickFirstRealImage(
  candidates: Array<string | null | undefined>,
): string | undefined {
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed && !isMagentoPlaceholderImage(trimmed)) {
      return trimmed;
    }
  }
  return undefined;
}

function normalizeConfigurableLabel(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

/** Prefer Magento ColorSwatchData hex (e.g. #D9B0CB); ignore image/text swatch paths. */
function resolveMagentoSwatchColor(
  swatchData: MagentoConfigurableOptionValue["swatch_data"] | null | undefined,
): string | undefined {
  const raw = swatchData?.value?.trim();
  if (!raw) {
    return undefined;
  }

  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(raw)) {
    return raw;
  }

  if (/^[0-9a-f]{6}$/i.test(raw)) {
    return `#${raw}`;
  }

  return undefined;
}

function mapConfigurableVariant(
  variant: MagentoConfigurableVariant,
): ProductConfigurable["variants"][number] | null {
  const child = variant.product;
  const sku = child?.sku?.trim();
  if (!child || !sku) {
    return null;
  }

  const pricing = resolveMagentoProductPricing(child);
  if (!pricing) {
    return null;
  }

  const images = buildGalleryImages(child);
  const image =
    pickFirstRealImage([images[0], child.image?.url]) ?? images[0] ?? child.image?.url?.trim() ?? "";
  if (!image || isMagentoPlaceholderImage(image)) {
    return null;
  }

  const attributes: Record<string, string> = {};
  const optionUids: string[] = [];

  for (const attribute of variant.attributes ?? []) {
    const code = attribute.code?.trim();
    const label = attribute.label?.trim();
    const uid = attribute.uid?.trim();
    if (code && label) {
      attributes[code] = label;
    }
    if (uid) {
      optionUids.push(uid);
    }
  }

  if (optionUids.length === 0) {
    return null;
  }

  return {
    sku,
    price: pricing.price,
    ...(pricing.originalPrice != null ? { originalPrice: pricing.originalPrice } : {}),
    image,
    images,
    inStock: child.stock_status === "IN_STOCK",
    attributes,
    optionUids,
  };
}

function mapMagentoConfigurable(
  product: MagentoProductDetailItem,
): ProductConfigurable | undefined {
  const rawOptions = product.configurable_options ?? [];
  const rawVariants = product.variants ?? [];
  if (rawOptions.length === 0 || rawVariants.length === 0) {
    return undefined;
  }

  const options = rawOptions
    .map((option) => {
      const attributeCode = option.attribute_code?.trim();
      if (!attributeCode) {
        return null;
      }

      const values = (option.values ?? [])
        .map((value) => {
          const uid = value.uid?.trim();
          const label = value.label?.trim();
          if (!uid || !label) {
            return null;
          }

          const swatchColor = resolveMagentoSwatchColor(value.swatch_data);

          return {
            id: normalizeConfigurableLabel(label),
            label: formatMetalColorLabel(label) || label,
            uid,
            ...(swatchColor ? { swatchColor } : {}),
          };
        })
        .filter((value): value is NonNullable<typeof value> => value !== null);

      if (values.length === 0) {
        return null;
      }

      return {
        attributeCode,
        label: option.label?.trim() || attributeCode,
        values,
      };
    })
    .filter((option): option is NonNullable<typeof option> => option !== null);

  const variants = rawVariants
    .map(mapConfigurableVariant)
    .filter((variant): variant is NonNullable<typeof variant> => variant !== null);

  if (options.length === 0 || variants.length === 0) {
    return undefined;
  }

  return { options, variants };
}

function resolveJewelleryCategory(
  categories: MagentoProductDetailItem["categories"],
): { name: string; urlKey?: string } {
  const list = categories ?? [];
  const diamondCategories = list.filter((category) => category.url_key?.startsWith("diamond-"));

  // Prefer a known jewellery leaf (rings/bangles/…) over a generic diamond-* parent.
  const leafCategory =
    diamondCategories.find((category) => {
      const urlKey = category.url_key?.trim();
      return Boolean(urlKey && MAGENTO_URL_KEY_TO_SLUG[urlKey]);
    }) ?? diamondCategories[0];

  const fallback = leafCategory ?? list[0];
  const name = fallback?.name?.trim() || "Jewellery";
  const urlKey = fallback?.url_key?.trim() || undefined;

  return urlKey ? { name, urlKey } : { name };
}

function resolveProductVideoUrl(
  items: MagentoCustomAttributeItem[] | null | undefined,
  mediaGallery: MagentoProductDetailItem["media_gallery"],
  referenceImageUrl?: string | null,
): string | undefined {
  const raw = getMagentoCustomAttributeValue(items, "product_video_url");
  if (!raw) {
    return undefined;
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  const resolvedFromCatalog = resolveMagentoModelWearImageUrl(
    raw,
    mediaGallery,
    referenceImageUrl,
  );
  if (resolvedFromCatalog) {
    return resolvedFromCatalog;
  }

  if (raw.startsWith("/")) {
    const storeOrigin = getMagentoGraphqlUrl().replace(/\/graphql$/, "");
    return `${storeOrigin}${raw}`;
  }

  return undefined;
}

function resolveDefaultMetalColorValue(
  configurable: ProductConfigurable | undefined,
  attributeMetalColor: string | null,
): string | undefined {
  if (attributeMetalColor) {
    return attributeMetalColor;
  }

  const metalOption =
    configurable?.options.find((option) => option.attributeCode === CONFIGURABLE_METAL_ATTRIBUTE_CODE) ??
    configurable?.options.find(
      (option) => /metal/i.test(option.attributeCode) || /metal/i.test(option.label),
    );

  return metalOption?.values[0]?.id;
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
  const metalColorRaw = getAttributeValue(attributes, "sd_metal_color");
  const metalColor = metalColorRaw ? formatMetalColorLabel(metalColorRaw) : null;
  const caratRaw = getAttributeValue(attributes, "sd_diamond_carat");
  const carat = formatCaratLabel(caratRaw);
  const ratingRaw = getAttributeValue(attributes, "sd_rating");
  const rating = ratingRaw ? Number(ratingRaw) : 0;

  const metal = [metalPurity, metalColor].filter(Boolean).join(" ") || "Gold";
  const configurable = mapMagentoConfigurable(product);
  const metalColorValue = resolveDefaultMetalColorValue(configurable, metalColorRaw);

  const { lifestyleImage: resolvedLifestyleImage } = resolveMagentoProductImages(
    product.media_gallery,
    product.image?.url,
    product.model_wear_image,
  );

  let images = buildGalleryImages(product);
  const defaultVariant =
    configurable?.variants.find((variant) => {
      if (!metalColorValue) {
        return false;
      }
      const metalLabel = variant.attributes[CONFIGURABLE_METAL_ATTRIBUTE_CODE];
      return (
        metalLabel?.trim().toLowerCase().replace(/[_\s]+/g, "-") ===
        metalColorValue.trim().toLowerCase().replace(/[_\s]+/g, "-")
      );
    }) ?? configurable?.variants[0];

  // Configurable parents often have no base image — use the default child gallery.
  if (images.length === 0 && defaultVariant?.images.length) {
    images = defaultVariant.images;
  }

  const fallbackImageSrc = getImageSrc(fallBackImage) || "";
  const primaryImage =
    pickFirstRealImage([
      images[0],
      defaultVariant?.image,
      product.image?.url,
      fallbackImageSrc,
    ]) ?? fallbackImageSrc;

  if (!primaryImage) {
    return null;
  }

  if (images.length === 0) {
    images = [primaryImage];
  }

  const lifestyleImage =
    pickFirstRealImage([resolvedLifestyleImage, images[1], defaultVariant?.images[1]]) ||
    primaryImage;

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
  const customOptions = mapMagentoProductCustomOptions(product.options);
  const productVideoUrl = resolveProductVideoUrl(
    product.custom_attributesV2?.items,
    product.media_gallery,
    product.image?.url,
  );
  const detailSections = mapMagentoProductDetailSections(product.custom_attributesV2?.items);
  const jewelleryCategory = resolveJewelleryCategory(product.categories);
  const categorySlug = jewelleryCategory.urlKey
    ? MAGENTO_URL_KEY_TO_SLUG[jewelleryCategory.urlKey]
    : undefined;

  return {
    id: sku,
    urlKey,
    name,
    price: pricing.price,
    originalPrice: pricing.originalPrice,
    description: stripHtml(product.description?.html) || name,
    shortDescription,
    category: jewelleryCategory.name,
    ...(jewelleryCategory.urlKey ? { categoryUrlKey: jewelleryCategory.urlKey } : {}),
    ...(categorySlug ? { categorySlug } : {}),
    image: primaryImage,
    images,
    lifestyleImage,
    carat,
    metal,
    ...(metalColorValue ? { metalColorValue } : {}),
    inStock: product.stock_status === "IN_STOCK",
    featured: false,
    rating: Number.isFinite(rating) ? rating : 0,
    reviews: 0,
    detailAttributes,
    engraving,
    customOptions,
    ...(configurable ? { configurable } : {}),
    productVideoUrl,
    ...(detailSections ? { detailSections } : {}),
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
