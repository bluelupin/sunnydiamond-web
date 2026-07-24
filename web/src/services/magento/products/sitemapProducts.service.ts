import { magentoGraphqlFetch } from "../graphqlClient";
import { MAGENTO_SITEMAP_PRODUCTS_QUERY } from "./sitemapProducts.query";
import type { MagentoProductsResponse } from "./magentoProduct.types";

const SITEMAP_PAGE_SIZE = 100;
const MAX_SITEMAP_PAGES = 100;

export type MagentoSitemapProduct = {
  urlKey: string;
};

export async function getMagentoProductSitemapEntries(
  signal?: AbortSignal,
): Promise<MagentoSitemapProduct[]> {
  const entries: MagentoSitemapProduct[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages && currentPage <= MAX_SITEMAP_PAGES) {
    const data = await magentoGraphqlFetch<MagentoProductsResponse>({
      query: MAGENTO_SITEMAP_PRODUCTS_QUERY,
      variables: {
        search: "",
        filter: {},
        pageSize: SITEMAP_PAGE_SIZE,
        currentPage,
        sort: { position: "ASC" },
      },
      signal,
    });

    const pageInfo = data.products?.page_info;
    totalPages = pageInfo?.total_pages ?? currentPage;

    for (const item of data.products?.items ?? []) {
      const urlKey = item.url_key?.trim();
      if (!urlKey) {
        continue;
      }

      entries.push({ urlKey });
    }

    currentPage += 1;
  }

  return entries;
}
