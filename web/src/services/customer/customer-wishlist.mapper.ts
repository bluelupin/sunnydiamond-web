import { normalizeWishlistSkus } from "@/features/wishlist/utils/wishlistProduct.utils";
import type { CustomerWishlist, CustomerWishlistItem } from "./customer-wishlist.types";

type MagentoWishlistItemNode = {
  id: string;
  product?: {
    sku?: string | null;
  } | null;
};

export type MagentoCustomerWishlistPageResponse = {
  customer: {
    wishlists: Array<{
      id: string;
      items_count?: number | null;
      items_v2?: {
        items: MagentoWishlistItemNode[];
        page_info?: {
          current_page?: number | null;
          total_pages?: number | null;
        } | null;
      } | null;
    }>;
  };
};

export function mapMagentoWishlistItems(
  items: MagentoWishlistItemNode[] | null | undefined,
): CustomerWishlistItem[] {
  const mapped: CustomerWishlistItem[] = [];

  for (const item of items ?? []) {
    const id = item.id?.trim();
    const sku = item.product?.sku?.trim();
    if (!id || !sku) {
      continue;
    }

    mapped.push({ id, sku });
  }

  return mapped;
}

export function mapMagentoCustomerWishlist(
  wishlistId: string,
  items: CustomerWishlistItem[],
): CustomerWishlist {
  const skus = normalizeWishlistSkus(items.map((item) => item.sku));

  return {
    wishlistId,
    skus,
    items,
  };
}
