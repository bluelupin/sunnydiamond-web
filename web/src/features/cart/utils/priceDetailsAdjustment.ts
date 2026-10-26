/** Difference between independently rounded display rows and the authoritative total. */
export type PriceDetailsAdjustmentInput = {
  subtotal: number;
  taxes: number;
  shippingAmount: number;
  offerDiscount: number;
  giftCardDiscount: number;
  totalShown: number;
};

export function calculatePriceDetailsAdjustment(input: PriceDetailsAdjustmentInput): number {
  const values = Object.values(input);
  if (values.some((value) => !Number.isFinite(value))) return 0;

  const shownRows =
    Math.round(input.subtotal) +
    Math.round(input.taxes) +
    Math.round(input.shippingAmount) -
    Math.round(input.offerDiscount) -
    Math.round(input.giftCardDiscount);
  return Math.round(input.totalShown) - shownRows;
}
