import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { magentoGraphqlFetch } from "../graphqlClient";
import { getMagentoProductAttributeOptions } from "./productAttributeOptions.service";
import { MAGENTO_PRODUCT_COLLECTION_ATTRIBUTE } from "./magentoAttribute.utils";
import type { MagentoProductListItem } from "./magentoProduct.types";
import { mapMagentoProductsToJewelleryListing } from "./products.mapper";
import { MAGENTO_COLLECTION_PRODUCTS_FILTER_QUERY } from "./collectionProducts.query";

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

async function fetchCollectionProductsByFilter(
  optionIds: string[],
  limit: number,
  signal?: AbortSignal,
): Promise<JewelleryListingProduct[]> {
  const data = await magentoGraphqlFetch<MagentoCollectionProductsFilterResponse>({
    query: MAGENTO_COLLECTION_PRODUCTS_FILTER_QUERY,
    variables: {
      filter: { [MAGENTO_PRODUCT_COLLECTION_ATTRIBUTE]: { in: optionIds } },
      pageSize: limit,
    },
    signal,
    preferGet: true,
  });

  return mapMagentoProductsToJewelleryListing(data.products?.items).slice(0, limit);
}

/**
 * Resolve a CMS collection slug to Magento's select-option ID, then use the
 * indexed collection filter. A catalog scan would make every homepage render
 * wait for several unrelated product queries.
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

  const options = await getMagentoProductAttributeOptions(MAGENTO_PRODUCT_COLLECTION_ATTRIBUTE, { signal });
  const optionIds = options
    .filter((item) => item.label.split(/[,;|]/).some(
      (label) => resolveMagentoCollectionValue(label) === collectionValue,
    ))
    .map((item) => item.value);
  if (optionIds.length === 0) {
    return [];
  }

  return fetchCollectionProductsByFilter(optionIds, limit, signal);
}
