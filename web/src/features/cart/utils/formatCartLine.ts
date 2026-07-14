import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { CartLineItem } from "../types/cart.types";

export const formatCartPrice = (price: number) => `₹${formatJewelleryPrice(price)}`;

export const formatCartLineMeta = (item: CartLineItem) => {
  const parts: string[] = [];
  if (item.options.ringSize) parts.push(`Size: ${item.options.ringSize}`);
  if (item.options.metal) parts.push(item.options.metal);
  return parts;
};
