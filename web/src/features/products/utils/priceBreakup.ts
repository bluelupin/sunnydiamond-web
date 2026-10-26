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
  isReconciled: boolean;
};

/** Whole rupees — matches `formatJewelleryPrice` display. */
function roundRupee(amount: number): number {
  return Math.round(amount);
}

export function buildPriceBreakup(
  components: ProductPriceBreakupComponents,
  pricing?: Pick<ProductDetailPricing, "originalPrice" | "price">,
): PriceBreakup {
  const metal = roundRupee(components.metalPrice);
  const stone = roundRupee(components.diamondPrice + components.gemstonePrice);
  const makingCharges = roundRupee(components.makingCharge + components.baseMakingCharge);
  const subtotal = metal + stone + makingCharges;
  const gst = roundRupee(subtotal * (components.gstRate / 100));

  const originalPrice = pricing?.originalPrice;
  const catalogPrice = pricing?.price;
  const hasCatalogDiscount =
    originalPrice != null && catalogPrice != null && originalPrice > catalogPrice;

  const discount = hasCatalogDiscount ? roundRupee(originalPrice - catalogPrice) : 0;

  const total = catalogPrice != null ? roundRupee(catalogPrice) : subtotal + gst - discount;

  return {
    metal,
    stone,
    makingCharges,
    subtotal,
    gst,
    gstRate: components.gstRate,
    discount,
    total,
    isReconciled: Math.abs(subtotal + gst - discount - total) <= 1,
  };
}

export function formatPriceBreakupGstLabel(gstRate: number): string {
  const formattedRate = Number.isInteger(gstRate)
    ? String(gstRate)
    : String(parseFloat(gstRate.toFixed(3)));
  return `GST (${formattedRate}%)`;
}
