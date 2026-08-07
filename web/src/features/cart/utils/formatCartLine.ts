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
  const display = getCartShippingDisplay(
    shipping,
    selectedShippingMethod,
    shippingMethods,
    estimatedShippingMethods,
  );
  return display.label;
};

export type CartShippingDisplay = {
  label: string;
  amount: number | null;
  isEstimated: boolean;
};

/** Cart page may show estimated shipping before a method is selected on the quote. */
export const getCartShippingDisplay = (
  shipping: number,
  selectedShippingMethod: MagentoSelectedShippingMethod | null,
  shippingMethods: MagentoShippingMethodOption[] = [],
  estimatedShippingMethods: MagentoShippingMethodOption[] = [],
): CartShippingDisplay => {
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
      isEstimated: false,
    };
  }

  const methods =
    shippingMethods.length > 0 ? shippingMethods : estimatedShippingMethods;

  if (methods.length === 0) {
    return {
      amount: null,
      label: "Calculated at checkout",
      isEstimated: false,
    };
  }

  const defaultMethod = pickDefaultShippingMethod(methods);
  if (!defaultMethod) {
    return {
      amount: null,
      label: "Calculated at checkout",
      isEstimated: false,
    };
  }

  return {
    amount: defaultMethod.amount,
    label: defaultMethod.amount === 0 ? "Free" : formatCartPrice(defaultMethod.amount),
    isEstimated: true,
  };
};

export const resolveCartDisplayTotal = (
  subtotal: number,
  taxes: number,
  grandTotal: number,
  shippingDisplay: CartShippingDisplay,
  offerDiscount = 0,
  giftCardDiscount = 0,
  localGiftCardDiscount = 0,
) => {
  const totalDiscount = offerDiscount + giftCardDiscount + localGiftCardDiscount;

  if (shippingDisplay.isEstimated && shippingDisplay.amount != null) {
    return subtotal - totalDiscount + taxes + shippingDisplay.amount;
  }

  return grandTotal - localGiftCardDiscount;
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
  localGiftCardDiscount = 0,
) => {
  const totalDiscount = offerDiscount + giftCardDiscount + localGiftCardDiscount;

  return shippingDisplay.isConfirmed
    ? grandTotal - localGiftCardDiscount
    : subtotal - totalDiscount + taxes;
};

export const formatCartLineMeta = (item: CartLineItem) => {
  const parts: string[] = [];
  if (item.options.ringSize) parts.push(`Size: ${item.options.ringSize}`);
  if (item.options.metal) parts.push(item.options.metal);
  return parts;
};
