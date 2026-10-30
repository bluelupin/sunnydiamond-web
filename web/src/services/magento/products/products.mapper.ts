import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import {
  getDefaultMetalColorId,
  getMetalColorOptions,
} from "@/features/products/utils/metalColorOptions.utils";
import { applySelectedMetalVariant, getConfigurableMetalOption } from "@/features/products/utils/productVariant.utils";
import type { MagentoProductDetailItem, MagentoProductListItem, MagentoMediaGalleryItem } from "./magentoProduct.types";
import {
  formatMagentoFacetLabel,
  getMagentoCustomAttributeValue,
  isMagentoBestSeller,
  isMagentoBooleanTruthy,
  isMagentoPlaceholderImage,
  normalizeGemstoneTypeLabel,
  normalizeMagentoCatalogProductImageUrl,
  resolveMagentoModelWearImageUrl,
} from "./magentoAttribute.utils";
import { resolveProductCatalogImagePriority } from "@/features/products/utils/productImagePlaceholder";
import { mapMagentoProductDetailToProduct } from "./productDetail.mapper";

function getActiveGalleryUrls(mediaGallery: MagentoMediaGalleryItem[] | null | undefined): string[] {
  return (mediaGallery ?? [])
    .filter((item) => item?.url && !item.disabled)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((item) => item.url!.trim());
}

function pickImageByRole(urls: string[], roles: Array<"f" | "sd" | "l" | "t">): string | null {
  return (
    urls.find((url) => {
      const lower = url.toLowerCase();
      const filename = lower.split("/").pop() ?? "";

      return roles.some((role) => {
        switch (role) {
          case "f":
            return /\/f\/_\/f_/.test(lower) || filename.startsWith("f_");
          case "sd":
            return /\/s\/d\/sd_/.test(lower) || filename.startsWith("sd_");
          case "l":
            return /\/l\/_\/l_/.test(lower) || filename.startsWith("l_");
          case "t":
            return /\/t\/_\/t_/.test(lower) || filename.startsWith("t_");
          default:
            return false;
        }
      });
    }) ?? null
  );
}

export function resolveMagentoProductImages(
  mediaGallery: MagentoMediaGalleryItem[] | null | undefined,
  fallbackImageUrl?: string | null,
  modelWearImage?: string | null,
): {
  primaryImage: string;
  lifestyleImage: string;
} {
  const urls = getActiveGalleryUrls(mediaGallery);

  const normalize = (url: string | null | undefined): string => {
    const trimmed = url?.trim() ?? "";
    if (!trimmed || isMagentoPlaceholderImage(trimmed)) {
      return "";
    }
    return normalizeMagentoCatalogProductImageUrl(trimmed);
  };

  const primaryImage =
    normalize(pickImageByRole(urls, ["f", "sd"])) ||
    normalize(urls[0]) ||
    normalize(fallbackImageUrl);

  const lifestyleImage =
    normalize(resolveMagentoModelWearImageUrl(modelWearImage, mediaGallery, fallbackImageUrl)) ||
    normalize(pickImageByRole(urls, ["l", "t"]));

  return { primaryImage, lifestyleImage };
}

function resolveProductCategory(categories: MagentoProductListItem["categories"]): string {
  const jewelleryCategory = (categories ?? []).find((category) =>
    category.url_key?.startsWith("diamond-"),
  );

  return jewelleryCategory?.name?.trim() || categories?.[0]?.name?.trim() || "";
}

/** Keep PLP's default display and the compact prices needed for filtered variants. */
function resolveListingVariantDisplay(product: MagentoProductListItem) {
  if (!product.variants?.length) {
    return null;
  }

  const mapped = mapMagentoProductDetailToProduct({
    ...product,
    stock_status: "IN_STOCK",
  } as MagentoProductDetailItem);

  if (!mapped?.configurable?.variants.length) {
    return null;
  }

  const metalColorOptions = getMetalColorOptions(mapped);
  const defaultMetalId = getDefaultMetalColorId(mapped, metalColorOptions);
  const metalAttributeCode = getConfigurableMetalOption(mapped)?.attributeCode ?? "sd_metal_color";
  const seen = new Set<string>();
  const variantPrices = mapped.configurable.variants.flatMap((variant) => {
    const metalColor = variant.attributes[metalAttributeCode]?.trim();
    if (!metalColor) return [];
    const metalPurity = variant.attributes.sd_metal_purity?.trim();
    const key = `${metalColor.toLowerCase()}|${metalPurity?.toLowerCase() ?? ""}`;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ metalColor, ...(metalPurity ? { metalPurity } : {}), price: variant.price }];
  });

  return {
    defaultDisplay: applySelectedMetalVariant(mapped, defaultMetalId),
    variantPrices,
    metalColorOptions: metalColorOptions.map(({ id, label }) => ({ id, label })),
  };
}

export function mapMagentoProductToJewelleryListing(
  product: MagentoProductListItem,
): JewelleryListingProduct | null {
  const sku = product.sku?.trim();
  const name = product.name?.trim();
  const urlKey = product.url_key?.trim();
  const variantDisplay = resolveListingVariantDisplay(product);
  const defaultVariantDisplay = variantDisplay?.defaultDisplay;
  const price =
    defaultVariantDisplay?.price ?? product.price_range?.minimum_price?.final_price?.value;

  if (!sku || !name || !urlKey || price == null) {
    return null;
  }

  const { primaryImage: resolvedPrimaryImage, lifestyleImage } = resolveMagentoProductImages(
    product.media_gallery,
    product.image?.url || product.small_image?.url || product.thumbnail?.url,
    product.model_wear_image,
  );

  const primaryImage = resolveProductCatalogImagePriority(
    defaultVariantDisplay?.image,
    resolvedPrimaryImage,
  );

  const customAttributes = product.custom_attributesV2?.items;
  const isBestseller = isMagentoBestSeller(customAttributes);
  const isLimitedEdition = isMagentoBooleanTruthy(getMagentoCustomAttributeValue(customAttributes, "sd_limited_edition"));
  const metalType = formatMagentoFacetLabel(
    getMagentoCustomAttributeValue(customAttributes, "sd_metal_type"),
  );
  const metalPurity =
    defaultVariantDisplay?.metalPurity?.trim() ||
    getMagentoCustomAttributeValue(customAttributes, "sd_metal_purity");
  const gemstoneType = normalizeGemstoneTypeLabel(
    getMagentoCustomAttributeValue(customAttributes, "sd_gemstone_type"),
  );

  return {
    id: sku,
    sku,
    urlKey,
    name,
    price,
    ...(variantDisplay?.variantPrices.length ? { variantPrices: variantDisplay.variantPrices } : {}),
    ...(variantDisplay?.metalColorOptions.length ? { metalColorOptions: variantDisplay.metalColorOptions } : {}),
    primaryImage,
    ...(lifestyleImage
      ? { modalImage: lifestyleImage, hoverImage: lifestyleImage }
      : {}),
    category: resolveProductCategory(product.categories),
    ...(metalType ? { metalType } : {}),
    ...(metalPurity ? { metalPurity } : {}),
    ...(gemstoneType ? { gemstoneType } : {}),
    ...(isBestseller ? { isBestseller: true } : {}),
    ...(isLimitedEdition ? { isLimitedEdition: true } : {}),
  };
}

export function mapMagentoProductsToJewelleryListing(
  items: MagentoProductListItem[] | null | undefined,
): JewelleryListingProduct[] {
  return (items ?? [])
    .map(mapMagentoProductToJewelleryListing)
    .filter((product): product is JewelleryListingProduct => product != null);
}

export function mapJewellerySortToMagento(
  sortValue: string,
): { position?: "ASC" | "DESC"; price?: "ASC" | "DESC"; name?: "ASC" | "DESC" } {
  switch (sortValue) {
    case "price-asc":
      return { price: "ASC" };
    case "price-desc":
      return { price: "DESC" };
    case "name-asc":
      return { name: "ASC" };
    default:
      return { position: "ASC" };
  }
}

/** Aligns grid order with card display price when Magento catalog sort is loose or page boundaries disagree. */
export function sortJewelleryListingProducts(
  products: JewelleryListingProduct[],
  sortValue: string,
): JewelleryListingProduct[] {
  if (sortValue === "featured" || products.length < 2) {
    return products;
  }

  const sorted = [...products];

  switch (sortValue) {
    case "price-asc":
      sorted.sort(
        (left, right) =>
          (Number(left.price) || 0) - (Number(right.price) || 0) ||
          left.name.localeCompare(right.name),
      );
      break;
    case "price-desc":
      sorted.sort(
        (left, right) =>
          (Number(right.price) || 0) - (Number(left.price) || 0) ||
          left.name.localeCompare(right.name),
      );
      break;
    case "name-asc":
      sorted.sort((left, right) => left.name.localeCompare(right.name));
      break;
    default:
      return products;
  }

  return sorted;
}
