import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { magentoGraphqlFetch } from "../graphqlClient";
import {
  MAGENTO_PRODUCT_COLLECTION_ATTRIBUTE,
  productMatchesMagentoCollection,
} from "./magentoAttribute.utils";
import type { MagentoProductListItem, MagentoProductsResponse } from "./magentoProduct.types";
import { mapMagentoProductsToJewelleryListing } from "./products.mapper";
import {
  MAGENTO_COLLECTION_PRODUCTS_FILTER_QUERY,
  MAGENTO_COLLECTION_PRODUCTS_SCAN_QUERY,
} from "./collectionProducts.query";

const COLLECTION_SCAN_PAGE_SIZE = 50;
const MAX_COLLECTION_SCAN_PAGES = 10;

type MagentoCollectionProductsFilterResponse = {
  products?: {
    items?: MagentoProductListItem[] | null;
  } | null;
};

/** Map Strapi collection slug to Magento `sd_collection` option value. */
export function resolveMagentoCollectionValue(strapiSlug: string): string {
  let value = strapiSlug.trim().toLowerCase().replace(/-/g, "_");

  if (value.endsWith("_collection")) {
    value = value.slice(0, -"_collection".length);
  }

  return value;
}

function isMatchingCollectionProduct(
  item: MagentoProductListItem,
  collectionValue: string,
): boolean {
  return productMatchesMagentoCollection(item.custom_attributesV2?.items, collectionValue);
}

async function fetchCollectionCatalogPage(
  currentPage: number,
  signal?: AbortSignal,
): Promise<MagentoProductsResponse> {
  return magentoGraphqlFetch<MagentoProductsResponse>({
    query: MAGENTO_COLLECTION_PRODUCTS_SCAN_QUERY,
    variables: {
      search: "",
      filter: {},
      pageSize: COLLECTION_SCAN_PAGE_SIZE,
      currentPage,
      sort: { position: "ASC" },
    },
    signal,
  });
}

async function fetchCollectionProductsByFilter(
  collectionValue: string,
  limit: number,
  signal?: AbortSignal,
): Promise<JewelleryListingProduct[]> {
  const data = await magentoGraphqlFetch<MagentoCollectionProductsFilterResponse>({
    query: MAGENTO_COLLECTION_PRODUCTS_FILTER_QUERY,
    variables: {
      filter: { [MAGENTO_PRODUCT_COLLECTION_ATTRIBUTE]: { in: [collectionValue] } },
      pageSize: limit,
    },
    signal,
    cache: "no-store",
  });

  return mapMagentoProductsToJewelleryListing(data.products?.items).slice(0, limit);
}

async function fetchCollectionProductsByScan(
  collectionValue: string,
  limit: number,
  signal?: AbortSignal,
): Promise<JewelleryListingProduct[]> {
  const firstPage = await fetchCollectionCatalogPage(1, signal);
  const totalPages = firstPage.products?.page_info?.total_pages ?? 1;
  const pagesToScan = Math.min(totalPages, MAX_COLLECTION_SCAN_PAGES);

  const pageResponses = await Promise.all(
    Array.from({ length: pagesToScan }, (_, index) => {
      const currentPage = index + 1;
      return currentPage === 1 ? Promise.resolve(firstPage) : fetchCollectionCatalogPage(currentPage, signal);
    }),
  );

  const matched: JewelleryListingProduct[] = [];

  for (const page of pageResponses) {
    const pageItems = (page.products?.items ?? []).filter((item) =>
      isMatchingCollectionProduct(item, collectionValue),
    );
    matched.push(...mapMagentoProductsToJewelleryListing(pageItems));

    if (matched.length >= limit) {
      break;
    }
  }

  return matched.slice(0, limit);
}

/**
 * Fetch Magento products for a collection attribute value (e.g. `diwali`).
 * Tries GraphQL filter first; falls back to catalog scan when filter is unsupported.
 */
export async function getMagentoProductsByCollection(
  strapiCollectionSlug: string,
  limit = 5,
  signal?: AbortSignal,
): Promise<JewelleryListingProduct[]> {
  const collectionValue = resolveMagentoCollectionValue(strapiCollectionSlug);
  if (!collectionValue) {
    return [];
  }

  try {
    const filtered = await fetchCollectionProductsByFilter(collectionValue, limit, signal);
    if (filtered.length > 0) {
      return filtered;
    }
  } catch {
    // Fall through to catalog scan.
  }

  return fetchCollectionProductsByScan(collectionValue, limit, signal);
}
