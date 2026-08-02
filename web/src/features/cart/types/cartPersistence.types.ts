import type { CartGiftingOptions, CartLineOptions } from "./cart.types";

export type StoredCartLine = {
  id: string;
  sku: string;
  quantity: number;
  options: CartLineOptions;
  gifting?: CartGiftingOptions;
};
