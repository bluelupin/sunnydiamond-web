import { magentoGraphqlFetch } from "../graphqlClient";
import {
  mapJewelleryListingToMoreForYouItems,
  MORE_FOR_YOU_PRODUCT_LIMIT,
  type MoreForYouCarouselItem,
} from "@/features/products/data/moreForYouContent";
import { MAGENTO_MORE_FOR_YOU_CATEGORY_FALLBACK_QUERY } from "./moreForYou.query";
import { mapMagentoProductsToJewelleryListing } from "./products.mapper";
import type {
  MagentoProductCategory,
  MagentoProductDetailItem,
  MagentoProductListItem,
} from "./magentoProduct.types";

type MoreForYouCategoryFallbackResponse = {
  products?: {
    items?: MagentoProductListItem[] | null;
  } | null;
};

function resolveJewelleryCategoryId(
  categories: MagentoProductCategory[] | null | undefined,
): string | null {
  const jewelleryCategory = (categories ?? []).find((category) =>
    category.url_key?.startsWith("diamond-"),
  );
  const categoryId = jewelleryCategory?.id ?? categories?.[0]?.id;

  return categoryId != null ? String(categoryId) : null;
}

async function fetchCategoryFallbackProducts(
  categoryId: string,
  pageSize: number,
  signal?: AbortSignal,
): Promise<MagentoProductListItem[]> {
  const data = await magentoGraphqlFetch<MoreForYouCategoryFallbackResponse>({
    query: MAGENTO_MORE_FOR_YOU_CATEGORY_FALLBACK_QUERY,
    variables: {
      categoryId,
      pageSize,
    },
    signal,
  });

  return data.products?.items ?? [];
}

export async function resolveMoreForYouProducts(
  item: MagentoProductDetailItem,
  signal?: AbortSignal,
): Promise<MoreForYouCarouselItem[]> {
  const currentSku = item.sku?.trim() ?? "";
  const relatedItems = (item.related_products ?? []).filter(
    (product): product is MagentoProductListItem => Boolean(product?.sku),
  );

  if (relatedItems.length > 0) {
    const relatedProducts = mapMagentoProductsToJewelleryListing(relatedItems);
    const mapped = mapJewelleryListingToMoreForYouItems(relatedProducts, currentSku);

    if (mapped.length > 0) {
      return mapped;
    }
  }

  const categoryId = resolveJewelleryCategoryId(item.categories);
  if (!categoryId) {
    return [];
  }

  const fallbackItems = await fetchCategoryFallbackProducts(
    categoryId,
    MORE_FOR_YOU_PRODUCT_LIMIT + 1,
    signal,
  );
  const fallbackProducts = mapMagentoProductsToJewelleryListing(fallbackItems);

  return mapJewelleryListingToMoreForYouItems(fallbackProducts, currentSku);
}
