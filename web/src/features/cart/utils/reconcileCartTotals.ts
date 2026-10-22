/**
 * Whole rupees — matches `formatJewelleryPrice` (Intl en-IN, no fraction digits).
 */
function toDisplayRupee(amount: number): number {
  return Math.round(amount);
}

/**
 * Aligns cart Price Details with the Total row (Magento grand_total at checkout).
 * Reconciliation uses display rupees (rounded per line), because each row is formatted
 * with zero decimal places while Magento sends paise-level values.
 */
export type ReconcileTaxesForPriceDetailsInput = {
  subtotal: number;
  taxes: number;
  shippingAmount: number;
  offerDiscount: number;
  giftCardDiscount: number;
  totalShown: number;
};

export function reconcileTaxesForPriceDetails({
  subtotal,
  taxes,
  shippingAmount,
  offerDiscount,
  giftCardDiscount,
  totalShown,
}: ReconcileTaxesForPriceDetailsInput): number {
  if (!Number.isFinite(totalShown) || !Number.isFinite(subtotal)) {
    return taxes;
  }

  const rupeeSubtotal = toDisplayRupee(subtotal);
  const rupeeTaxes = toDisplayRupee(taxes);
  const rupeeShipping = toDisplayRupee(shippingAmount);
  const rupeeOffer = toDisplayRupee(offerDiscount);
  const rupeeGiftCard = toDisplayRupee(giftCardDiscount);
  const rupeeTotal = toDisplayRupee(totalShown);

  const computed =
    rupeeSubtotal + rupeeTaxes + rupeeShipping - rupeeOffer - rupeeGiftCard;

  if (computed === rupeeTotal) {
    return rupeeTaxes;
  }

  const adjusted =
    rupeeTotal - rupeeSubtotal - rupeeShipping + rupeeOffer + rupeeGiftCard;

  if (!Number.isFinite(adjusted)) {
    return rupeeTaxes;
  }

  return Math.max(0, adjusted);
}

/** Used when mapping Magento cart — totalShown is grand_total. */
export type ReconcileCartTotalsInput = {
  subtotal: number;
  taxes: number;
  shipping: number;
  offerDiscount: number;
  giftCardDiscount: number;
  grandTotal: number;
};

export function reconcileCartTaxesForDisplay(input: ReconcileCartTotalsInput): number {
  return reconcileTaxesForPriceDetails({
    subtotal: input.subtotal,
    taxes: input.taxes,
    shippingAmount: input.shipping,
    offerDiscount: input.offerDiscount,
    giftCardDiscount: input.giftCardDiscount,
    totalShown: input.grandTotal,
  });
}
