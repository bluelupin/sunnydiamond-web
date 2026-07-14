import { cartFlowSpec } from "../data/cartFlowSpec";
import type { CartLineItem } from "../types/cart.types";

export const calculateCartSubtotal = (items: CartLineItem[]) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export const calculateCartTaxes = (subtotal: number) =>
  subtotal > 0 ? Math.round(subtotal * cartFlowSpec.taxRate) : 0;

export const calculateCartTotal = (items: CartLineItem[]) => {
  const subtotal = calculateCartSubtotal(items);
  const taxes = calculateCartTaxes(subtotal);
  return subtotal + taxes;
};
