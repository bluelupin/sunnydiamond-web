import type { FeaturedCarouselItem } from "@/features/cms/components/home/FeaturedProductsCarousel";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { getImageSrc } from "@/shared/utils/image";
import { magentoGraphqlFetch } from "../graphqlClient";
import { isMagentoTrending } from "./magentoAttribute.utils";
import type { MagentoProductListItem, MagentoProductsResponse } from "./magentoProduct.types";
import {
  mapMagentoProductsToJewelleryListing,
} from "./products.mapper";
import { MAGENTO_TRENDING_PRODUCTS_SCAN_QUERY } from "./trendingProducts.query";

const TRENDING_SCAN_PAGE_SIZE = 50;
const MAX_TRENDING_PRODUCTS = 24;

function isTrendingMagentoProduct(item: MagentoProductListItem): boolean {
  return isMagentoTrending(item.custom_attributesV2?.items);
}

/**
 * Magento exposes `sd_trending` on product attributes but not in
 * `ProductAttributeFilterInput`, so we scan catalog pages and filter locally.
 */
export async function getMagentoTrendingProducts(
  limit = MAX_TRENDING_PRODUCTS,
  signal?: AbortSignal,
): Promise<JewelleryListingProduct[]> {
  const trending: JewelleryListingProduct[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (trending.length < limit && currentPage <= totalPages) {
    const data = await magentoGraphqlFetch<MagentoProductsResponse>({
      query: MAGENTO_TRENDING_PRODUCTS_SCAN_QUERY,
      variables: {
        search: "",
        filter: {},
        pageSize: TRENDING_SCAN_PAGE_SIZE,
        currentPage,
        sort: { position: "ASC" },
      },
      signal,
      cache: "no-store",
    });

    totalPages = data.products?.page_info?.total_pages ?? 1;

    const pageItems = (data.products?.items ?? []).filter(isTrendingMagentoProduct);
    trending.push(...mapMagentoProductsToJewelleryListing(pageItems));

    currentPage += 1;
  }

  return trending.slice(0, limit);
}

export function mapJewelleryListingToFeaturedCarouselItems(
  products: JewelleryListingProduct[],
): FeaturedCarouselItem[] {
  return products.map((product) => ({
    id: product.sku,
    name: product.name,
    price: product.price,
    image: getImageSrc(product.primaryImage),
    href: `/product/${product.urlKey}`,
  }));
}
