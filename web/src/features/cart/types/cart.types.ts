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

/** Complete desired gifting state for the whole bag, as saved from the gifting panel. */
export type CartGiftingSelection = {
  mode: "single" | "separate";
  groupedNote?: string;
  items: Array<{ lineItemId: string; isGift: boolean; note?: string }>;
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
  /** Magento configurable option value UIDs (e.g. gold color) for addProductsToCart. */
  configurableOptionUids?: string[];
};

export type AddItemResult = {
  lineItemId: string;
  lineItem: CartLineItem;
  totalItemsAfterAdd: number;
};
