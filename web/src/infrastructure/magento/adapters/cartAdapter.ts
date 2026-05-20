import type { MagentoCart, MagentoCartItem } from "../types";
import type { CartItem } from "@/features/cart/context/CartContext";
import { transformMagentoProduct } from "./productAdapter";

export function transformMagentoCartItem(magentoItem: MagentoCartItem): CartItem {
  return {
    product: transformMagentoProduct(magentoItem.product),
    quantity: magentoItem.quantity,
  };
}

export function transformMagentoCart(magentoCart: MagentoCart): CartItem[] {
  if (!magentoCart || !magentoCart.items) return [];
  return magentoCart.items.map(transformMagentoCartItem);
}
