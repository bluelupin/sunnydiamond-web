import type { ProductDetailPricing } from "@/features/products/types/productDetail";

export type PriceBreakup = {
  metal: number;
  stone: number;
  makingCharges: number;
  discount: number;
  total: number;
};

const METAL_RATIO = 12 / 21;
const STONE_RATIO = 4 / 21;
const MAKING_RATIO = 5 / 21;

/** Derives a price breakup from catalog pricing until Magento exposes component prices. */
export function derivePriceBreakup(pricing: ProductDetailPricing): PriceBreakup {
  const total = pricing.price;
  const discount =
    pricing.originalPrice != null && pricing.originalPrice > total
      ? pricing.originalPrice - total
      : 0;
  const subtotalBeforeDiscount = total + discount;

  const metal = Math.round(subtotalBeforeDiscount * METAL_RATIO);
  const stone = Math.round(subtotalBeforeDiscount * STONE_RATIO);
  const makingCharges = Math.max(
    0,
    Math.round(subtotalBeforeDiscount * MAKING_RATIO) || subtotalBeforeDiscount - metal - stone,
  );

  return {
    metal,
    stone,
    makingCharges,
    discount,
    total,
  };
}
