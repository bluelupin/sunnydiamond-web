import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { MagentoSelectedShippingMethod, MagentoShippingMethodOption } from "@/services/magento/cart/magentoCart.types";
import { pickDefaultShippingMethod } from "@/services/magento/cart/cart.mapper";
import type { CartLineItem } from "../types/cart.types";

export const formatCartPrice = (price: number) => `₹${formatJewelleryPrice(price)}`;

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

export const formatCartLineMeta = (item: CartLineItem) => {
  const parts: string[] = [];
  if (item.options.ringSize) parts.push(`Size: ${item.options.ringSize}`);
  if (item.options.metal) parts.push(item.options.metal);
  return parts;
};
