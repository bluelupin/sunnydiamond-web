import type { Product } from "@/features/products/data/products";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import type { CartLineItem } from "../types/cart.types";
import type { StoredCartLine } from "../types/cartPersistence.types";
import { buildProductSeo } from "@/shared/lib/seo/productSeo";

const CART_STORAGE_KEY = "sunny-cart-v2";
const LEGACY_CART_STORAGE_KEY = "sunny-cart-v1";

type LegacyCartLineItem = {
  id?: string;
  product?: { id?: string };
  quantity?: number;
  options?: CartLineItem["options"];
  gifting?: CartLineItem["gifting"];
};

function isStoredCartLine(value: unknown): value is StoredCartLine {
  if (!value || typeof value !== "object") {
    return false;
  }

  const line = value as StoredCartLine;
  return (
    typeof line.id === "string" &&
    typeof line.sku === "string" &&
    typeof line.quantity === "number" &&
    line.quantity > 0 &&
    typeof line.options === "object" &&
    line.options != null
  );
}

function migrateLegacyCartLine(value: unknown): StoredCartLine | null {
  if (isStoredCartLine(value)) {
    return {
      id: value.id,
      sku: value.sku.trim(),
      quantity: value.quantity,
      options: value.options,
      gifting: value.gifting,
    };
  }

  const legacy = value as LegacyCartLineItem;
  const sku = legacy.product?.id?.trim();
  const id = legacy.id?.trim();

  if (!sku || !id || typeof legacy.quantity !== "number" || legacy.quantity <= 0) {
    return null;
  }

  return {
    id,
    sku,
    quantity: legacy.quantity,
    options: legacy.options ?? {},
    gifting: legacy.gifting,
  };
}

export function readStoredCartLines(): StoredCartLine[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const current = window.localStorage.getItem(CART_STORAGE_KEY);
    const raw = current ?? window.localStorage.getItem(LEGACY_CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const lines = parsed
      .map(migrateLegacyCartLine)
      .filter((line): line is StoredCartLine => line != null);

    if (!current) {
      writeStoredCartLines(lines);
    }

    return lines;
  } catch {
    return [];
  }
}

export function writeStoredCartLines(lines: StoredCartLine[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}

export function mapListingProductToCartProduct(listing: JewelleryListingProduct): Product {
  return {
    id: listing.sku,
    urlKey: listing.urlKey,
    name: listing.name,
    price: listing.price,
    description: listing.name,
    shortDescription: listing.name,
    category: listing.category,
    image: listing.primaryImage,
    images: [listing.primaryImage],
    lifestyleImage: listing.modalImage ?? listing.hoverImage,
    carat: listing.metalPurity ?? "",
    metal: listing.metalPurity ?? "",
    inStock: true,
    featured: false,
    bestseller: listing.isBestseller,
    rating: 0,
    reviews: 0,
    detailAttributes: [],
    seo: buildProductSeo({
      name: listing.name,
      urlKey: listing.urlKey,
      shortDescription: listing.name,
    }),
  };
}

export function mergeStoredLinesWithProducts(
  storedLines: StoredCartLine[],
  productsBySku: Map<string, Product>,
  optimisticProducts: Record<string, Product>,
): CartLineItem[] {
  const items: CartLineItem[] = [];

  for (const line of storedLines) {
    const product = productsBySku.get(line.sku) ?? optimisticProducts[line.sku];
    if (!product) {
      continue;
    }

    items.push({
      id: line.id,
      product,
      quantity: line.quantity,
      options: line.options,
      gifting: line.gifting,
    });
  }

  return items;
}
