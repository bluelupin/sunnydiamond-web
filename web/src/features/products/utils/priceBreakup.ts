import type { ProductDetailPricing } from "@/features/products/types/productDetail";
import type { ProductPriceBreakupComponents } from "@/services/magento/products/productPriceBreakup.utils";

export type PriceBreakup = {
  metal: number;
  stone: number;
  makingCharges: number;
  subtotal: number;
  gst: number;
  gstRate: number;
  discount: number;
  total: number;
};

export function buildPriceBreakup(
  components: ProductPriceBreakupComponents,
  pricing?: Pick<ProductDetailPricing, "originalPrice" | "price">,
): PriceBreakup {
  const metal = components.metalPrice;
  const stone = components.diamondPrice + components.gemstonePrice;
  const makingCharges = components.makingCharge;
  const subtotal =
    components.metalPrice + components.diamondPrice + components.makingCharge;
  const gst = subtotal * (components.gstRate / 100);
  const total = subtotal + gst;
  const discount =
    pricing?.originalPrice != null && pricing.price != null && pricing.originalPrice > pricing.price
      ? pricing.originalPrice - pricing.price
      : 0;

  return {
    metal,
    stone,
    makingCharges,
    subtotal,
    gst,
    gstRate: components.gstRate,
    discount,
    total,
  };
}

export function formatPriceBreakupGstLabel(gstRate: number): string {
  const formattedRate = Number.isInteger(gstRate)
    ? String(gstRate)
    : String(parseFloat(gstRate.toFixed(3)));
  return `GST (${formattedRate}%)`;
}
