import type { Product } from "@/features/products/data/products";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";

export type CartLineOptions = {
  metal?: string;
  ringSize?: string;
  engraving?: string;
  engravingFont?: string;
  engravingMaxCharacters?: number;
  isGift?: boolean;
};

export type CartGiftingOptions = {
  note?: string;
  wrapMode?: "single" | "separate";
};

export type CartLineItem = {
  id: string;
  product: Product;
  quantity: number;
  options: CartLineOptions;
  gifting?: CartGiftingOptions;
};

export type AddToBagPayload = {
  product: Product;
  options?: CartLineOptions;
  productCustomOptions?: ProductCustomOptions;
};

export type AddItemResult = {
  lineItemId: string;
  lineItem: CartLineItem;
  totalItemsAfterAdd: number;
};
