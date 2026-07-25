import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { MagentoSelectedShippingMethod, MagentoShippingMethodOption } from "@/services/magento/cart/magentoCart.types";
import { pickDefaultShippingMethod } from "@/services/magento/cart/cart.mapper";
import type { CartLineItem } from "../types/cart.types";

export const formatCartPrice = (price: number) => `₹${formatJewelleryPrice(price)}`;

export const formatCartDiscountPrice = (price: number) =>
  `-${formatCartPrice(price)}`;

export const getCartShippingLabel = (
  shipping: number,
  selectedShippingMethod: MagentoSelectedShippingMethod | null,
  shippingMethods: MagentoShippingMethodOption[] = [],
  estimatedShippingMethods: MagentoShippingMethodOption[] = [],
) => {
  if (selectedShippingMethod) {
    const selectedAmount =
      selectedShippingMethod.amount ??
      shippingMethods.find(
        (method) =>
          method.carrierCode === selectedShippingMethod.carrierCode &&
          method.methodCode === selectedShippingMethod.methodCode,
      )?.amount ??
      shipping;

    if (selectedAmount === 0) {
      return "Free";
    }

    return formatCartPrice(selectedAmount);
  }

  const methods =
    shippingMethods.length > 0 ? shippingMethods : estimatedShippingMethods;

  if (methods.length === 0) {
    return "Calculated at checkout";
  }

  const defaultMethod = pickDefaultShippingMethod(methods);
  if (!defaultMethod) {
    return "Calculated at checkout";
  }

  return defaultMethod.amount === 0 ? "Free" : formatCartPrice(defaultMethod.amount);
};

export type CheckoutShippingDisplay = {
  label: string;
  amount: number | null;
  isConfirmed: boolean;
};

/** Checkout must only show Magento rates after the delivery address is on the cart. */
export const getCheckoutShippingDisplay = (
  shipping: number,
  selectedShippingMethod: MagentoSelectedShippingMethod | null,
  shippingMethods: MagentoShippingMethodOption[] = [],
): CheckoutShippingDisplay => {
  if (selectedShippingMethod) {
    const amount =
      selectedShippingMethod.amount ??
      shippingMethods.find(
        (method) =>
          method.carrierCode === selectedShippingMethod.carrierCode &&
          method.methodCode === selectedShippingMethod.methodCode,
      )?.amount ??
      shipping;

    return {
      amount,
      label: amount === 0 ? "Free" : formatCartPrice(amount),
      isConfirmed: true,
    };
  }

  return {
    amount: null,
    label: "Calculated at checkout",
    isConfirmed: false,
  };
};

export const resolveCheckoutDisplayTotal = (
  subtotal: number,
  taxes: number,
  grandTotal: number,
  shippingDisplay: CheckoutShippingDisplay,
  offerDiscount = 0,
  giftCardDiscount = 0,
) =>
  shippingDisplay.isConfirmed
    ? grandTotal
    : subtotal - offerDiscount - giftCardDiscount + taxes;

export const formatCartLineMeta = (item: CartLineItem) => {
  const parts: string[] = [];
  if (item.options.ringSize) parts.push(`Size: ${item.options.ringSize}`);
  if (item.options.metal) parts.push(item.options.metal);
  return parts;
};
