import type { MagentoProductDetailItem } from "./magentoProduct.types";

export type MagentoProductPricing = {
  price: number;
  originalPrice?: number;
};

export function resolveMagentoProductPricing(
  product: Pick<MagentoProductDetailItem, "price_range" | "special_price">,
): MagentoProductPricing | null {
  const finalPrice = product.price_range?.minimum_price?.final_price?.value;
  const regularPrice = product.price_range?.minimum_price?.regular_price?.value;
  const specialPrice = product.special_price ?? null;

  if (finalPrice == null || !Number.isFinite(finalPrice)) {
    return null;
  }

  const hasActiveSpecialPrice =
    specialPrice != null &&
    Number.isFinite(specialPrice) &&
    specialPrice > 0 &&
    regularPrice != null &&
    specialPrice < regularPrice;

  const hasCatalogDiscount =
    regularPrice != null && Number.isFinite(regularPrice) && regularPrice > finalPrice;

  if (!hasActiveSpecialPrice && !hasCatalogDiscount) {
    return { price: finalPrice };
  }

  return {
    price: finalPrice,
    originalPrice: regularPrice ?? undefined,
  };
}
