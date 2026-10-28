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
  const preciseStone = components.diamondPrice + components.gemstonePrice;
  const preciseMakingCharges = components.makingCharge + components.baseMakingCharge;
  let metal = roundRupee(components.metalPrice);
  let stone = roundRupee(components.diamondPrice) + roundRupee(components.gemstonePrice);
  let makingCharges = roundRupee(components.makingCharge) + roundRupee(components.baseMakingCharge);
  const subtotalBeforeTax = metal + stone + makingCharges;
  const gst = roundRupee(subtotalBeforeTax * (components.gstRate / 100));

  const originalPrice = pricing?.originalPrice;
  const catalogPrice = pricing?.price;
  const hasCatalogDiscount =
    originalPrice != null && catalogPrice != null && originalPrice > catalogPrice;

  const discount = hasCatalogDiscount ? roundRupee(originalPrice - catalogPrice) : 0;

  const total = catalogPrice != null
    ? roundRupee(catalogPrice)
    : roundRupee(subtotalBeforeTax + subtotalBeforeTax * (components.gstRate / 100) - discount);
  const difference = total - (metal + stone + makingCharges + gst - discount);

  // Balance a one-rupee display difference against the component whose rounded
  // value moves closest to its precise Magento value. Never change the GST row.
  if (Math.abs(difference) === 1) {
    const lines = [
      { precise: components.metalPrice, shown: metal },
      { precise: preciseStone, shown: stone },
      { precise: preciseMakingCharges, shown: makingCharges },
    ];
    const bestIndex = lines.reduce((best, line, index) => {
      if (line.shown + difference < 0) return best;
      const cost = Math.abs(line.shown + difference - line.precise) - Math.abs(line.shown - line.precise);
      const bestLine = lines[best];
      const bestCost = Math.abs(bestLine.shown + difference - bestLine.precise) - Math.abs(bestLine.shown - bestLine.precise);
      return cost < bestCost ? index : best;
    }, 0);
    if (bestIndex === 0) metal += difference;
    if (bestIndex === 1) stone += difference;
    if (bestIndex === 2) makingCharges += difference;
  }
  const subtotal = metal + stone + makingCharges;

  return {
    metal,
    stone,
    makingCharges,
    subtotal,
    gst,
    gstRate: components.gstRate,
    discount,
    total,
    isReconciled: subtotal + gst - discount === total,
  };
}

export function formatPriceBreakupGstLabel(gstRate: number): string {
  const formattedRate = Number.isInteger(gstRate)
    ? String(gstRate)
    : String(parseFloat(gstRate.toFixed(3)));
  return `GST (${formattedRate}%)`;
}
