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

/** Whole rupees — matches `formatJewelleryPrice` display. */
function roundRupee(amount: number): number {
  return Math.round(amount);
}

/**
 * Reconcile rounded lines so Metal + Stone + Making + GST − Discount === Total.
 * Adjusts GST first, then discount, without changing metal/stone/making.
 */
function reconcileBreakupLines(input: {
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
}): { gst: number; discount: number } {
  let { gst, discount, total, subtotal } = input;
  let computed = subtotal + gst - discount;

  if (computed === total) {
    return { gst, discount };
  }

  const diff = computed - total;
  gst = gst - diff;
  computed = subtotal + gst - discount;

  if (computed !== total) {
    discount = Math.max(0, discount + (computed - total));
  }

  return { gst, discount };
}

export function buildPriceBreakup(
  components: ProductPriceBreakupComponents,
  pricing?: Pick<ProductDetailPricing, "originalPrice" | "price">,
): PriceBreakup {
  const metal = roundRupee(components.metalPrice);
  const stone = roundRupee(components.diamondPrice + components.gemstonePrice);
  const makingCharges = roundRupee(components.makingCharge);
  const subtotal = metal + stone + makingCharges;
  let gst = roundRupee(subtotal * (components.gstRate / 100));

  const originalPrice = pricing?.originalPrice;
  const catalogPrice = pricing?.price;
  const hasCatalogDiscount =
    originalPrice != null && catalogPrice != null && originalPrice > catalogPrice;

  let discount = hasCatalogDiscount ? roundRupee(originalPrice - catalogPrice) : 0;

  const total = catalogPrice != null ? roundRupee(catalogPrice) : subtotal + gst - discount;

  ({ gst, discount } = reconcileBreakupLines({ subtotal, gst, discount, total }));

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
