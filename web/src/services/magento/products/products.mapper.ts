import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import type { MagentoProductListItem, MagentoMediaGalleryItem } from "./magentoProduct.types";
import {
  formatMagentoFacetLabel,
  getMagentoCustomAttributeValue,
  isMagentoBestSeller,
  normalizeGemstoneTypeLabel,
} from "./magentoAttribute.utils";

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

export function resolveMagentoProductImages(mediaGallery: MagentoMediaGalleryItem[] | null | undefined): {
  primaryImage: string;
  lifestyleImage: string;
} {
  const urls = getActiveGalleryUrls(mediaGallery);

  const primaryImage = pickImageByRole(urls, ["f", "sd"]) ?? "";
  const lifestyleImage = pickImageByRole(urls, ["l", "t"]) ?? "";

  return { primaryImage, lifestyleImage };
}

function resolveProductCategory(categories: MagentoProductListItem["categories"]): string {
  const jewelleryCategory = (categories ?? []).find((category) =>
    category.url_key?.startsWith("diamond-"),
  );

  return jewelleryCategory?.name?.trim() || categories?.[0]?.name?.trim() || "";
}

export function mapMagentoProductToJewelleryListing(
  product: MagentoProductListItem,
): JewelleryListingProduct | null {
  const sku = product.sku?.trim();
  const name = product.name?.trim();
  const urlKey = product.url_key?.trim();
  const price = product.price_range?.minimum_price?.final_price?.value;

  if (!sku || !name || !urlKey || price == null) {
    return null;
  }

  const { primaryImage, lifestyleImage } = resolveMagentoProductImages(product.media_gallery);

  if (!primaryImage) {
    return null;
  }

  const customAttributes = product.custom_attributesV2?.items;
  const isBestseller = isMagentoBestSeller(customAttributes);
  const metalType = formatMagentoFacetLabel(
    getMagentoCustomAttributeValue(customAttributes, "sd_metal_type"),
  );
  const metalPurity = getMagentoCustomAttributeValue(customAttributes, "sd_metal_purity");
  const gemstoneType = normalizeGemstoneTypeLabel(
    getMagentoCustomAttributeValue(customAttributes, "sd_gemstone_type"),
  );

  return {
    id: sku,
    sku,
    urlKey,
    name,
    price,
    primaryImage,
    ...(lifestyleImage
      ? { modalImage: lifestyleImage, hoverImage: lifestyleImage }
      : {}),
    category: resolveProductCategory(product.categories),
    ...(metalType ? { metalType } : {}),
    ...(metalPurity ? { metalPurity } : {}),
    ...(gemstoneType ? { gemstoneType } : {}),
    ...(isBestseller ? { isBestseller: true } : {}),
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
