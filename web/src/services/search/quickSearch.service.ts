import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import {
  buildJewelleryCategoryHref,
  isJewelleryCategoryUrlKey,
} from "@/features/jewellery-product/utils/jewelleryRoutes";
import { buildJewelleryCollectionHref } from "@/features/jewellery-product/utils/collectionListing";
import {
  searchResultsHref,
  type QuickSearchProduct,
  type QuickSearchResult,
  type SearchLink,
  type SearchSuggestions,
} from "@/features/search/quickSearch";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MAGENTO_PRODUCT_COLLECTION_ATTRIBUTE } from "@/services/magento/products/magentoAttribute.utils";
import { getMagentoProductAttributeOptions } from "@/services/magento/products/productAttributeOptions.service";

const RESULT_CACHE_SECONDS = 60;
const CONFIG_CACHE_SECONDS = 3600;
/** Dropdown lookups must not count as searches in Magento's popular-search log. */
const SUGGEST_HEADERS = { "X-Sunny-Search-Mode": "suggest" };

const PRODUCTS_QUERY = `
  query SunnyQuickSearchProducts($search: String!, $pageSize: Int!) {
    products(search: $search, pageSize: $pageSize) {
      items {
        sku
        name
        url_key
        small_image { url }
        price_range {
          minimum_price { final_price { value } }
          maximum_price { final_price { value } }
        }
      }
    }
  }
`;

const CATEGORIES_QUERY = `
  query SunnyQuickSearchCategories($query: String!) {
    sunnySearchCategories(query: $query, limit: 4) { name url_key url_path parent_name }
  }
`;

const POPULAR_QUERY = `query SunnyPopularSearches { sunnyPopularSearches(limit: 6) }`;

type ProductsResponse = {
  products?: {
    items?: Array<{
      sku: string;
      name: string;
      url_key: string;
      small_image?: { url?: string | null } | null;
      price_range?: {
        minimum_price?: { final_price?: { value?: number | null } | null } | null;
        maximum_price?: { final_price?: { value?: number | null } | null } | null;
      } | null;
    } | null>;
  } | null;
};

type CategoriesResponse = {
  sunnySearchCategories?: Array<{
    name?: string | null;
    url_key?: string | null;
    url_path?: string | null;
    parent_name?: string | null;
  } | null> | null;
};

type SearchConfigLink = { label?: string | null; href?: string | null; keywords?: string | null };
type SearchConfig = {
  popularSearches?: SearchConfigLink[] | null;
  serviceShortcuts?: SearchConfigLink[] | null;
  educationLinks?: SearchConfigLink[] | null;
};

type BlogPost = { title?: string | null; slug?: string | null };

async function settle<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

function getSearchConfig(): Promise<SearchConfig | null> {
  return settle(
    apiFetch<SearchConfig>("api/search-config", {
      params: { populate: "*" },
      next: { revalidate: CONFIG_CACHE_SECONDS },
    }),
    null,
  );
}

function toLinks(links: SearchConfigLink[] | null | undefined): Array<SearchLink & { keywords: string[] }> {
  return (links ?? []).flatMap((link) => {
    const label = link?.label?.trim();
    const href = link?.href?.trim();
    if (!label || !href) return [];
    const keywords = (link.keywords ?? "")
      .split(",")
      .map((keyword) => keyword.trim().toLowerCase())
      .filter(Boolean);
    return [{ label, href, keywords }];
  });
}

/** "emi" matches keyword "emi"; "store near me" matches "near me"; "certif" matches "certification". */
function keywordMatches(query: string, keywords: string[]): boolean {
  const q = query.toLowerCase();
  return keywords.some(
    (keyword) =>
      q === keyword ||
      (keyword.length >= 3 && q.includes(keyword)) ||
      (q.length >= 3 && keyword.startsWith(q)),
  );
}

async function searchProducts(query: string): Promise<QuickSearchProduct[]> {
  const data = await magentoGraphqlFetch<ProductsResponse>({
    query: PRODUCTS_QUERY,
    variables: { search: query, pageSize: 6 },
    headers: SUGGEST_HEADERS,
    revalidateSeconds: RESULT_CACHE_SECONDS,
  });

  return (data.products?.items ?? []).flatMap((item) => {
    if (!item?.url_key) return [];
    const min = item.price_range?.minimum_price?.final_price?.value ?? 0;
    const max = item.price_range?.maximum_price?.final_price?.value ?? min;
    return [{
      sku: item.sku,
      name: item.name,
      href: `/product/${item.url_key}`,
      image: item.small_image?.url ?? null,
      price: min,
      fromPrice: max > min,
    }];
  });
}

async function searchCategories(query: string): Promise<SearchLink[]> {
  if (query.length < 3) return [];
  const data = await magentoGraphqlFetch<CategoriesResponse>({
    query: CATEGORIES_QUERY,
    variables: { query },
    headers: SUGGEST_HEADERS,
    revalidateSeconds: RESULT_CACHE_SECONDS,
  });

  // Only main categories have pages; a sub-category ("Thali") opens its main category.
  return (data.sunnySearchCategories ?? []).flatMap((category) => {
    const topUrlKey = category?.url_path?.split("/")[0] ?? "";
    if (!category?.name || !isJewelleryCategoryUrlKey(topUrlKey)) return [];
    return [{
      label: category.name,
      href: buildJewelleryCategoryHref(topUrlKey),
      detail: category.parent_name ? `in ${category.parent_name}` : undefined,
    }];
  });
}

async function searchCollections(query: string): Promise<SearchLink[]> {
  if (query.length < 3) return [];
  const q = query.toLowerCase();
  const options = await getMagentoProductAttributeOptions(MAGENTO_PRODUCT_COLLECTION_ATTRIBUTE);

  return options
    .map((option) => ({ option, name: option.label.replace(/_/g, " ").trim() }))
    .filter(({ name }) => name.toLowerCase().includes(q))
    .map(({ option, name }) => ({
      label: name.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase()),
      href: buildJewelleryCollectionHref(option.label),
      detail: "Collection",
    }));
}

async function searchArticles(query: string, config: SearchConfig | null): Promise<SearchLink[]> {
  const education = toLinks(config?.educationLinks)
    .filter((link) => keywordMatches(query, link.keywords))
    .map(({ label, href }) => ({ label, href, detail: "Learn" }));
  if (query.length < 3) return education.slice(0, 2);

  const posts = await settle(
    apiFetch<BlogPost[]>(STRAPI_ENDPOINTS.blogPosts, {
      params: {
        "filters[$or][0][title][$containsi]": query,
        "filters[$or][1][excerpt][$containsi]": query,
        "fields[0]": "title",
        "fields[1]": "slug",
        "pagination[pageSize]": 2,
        sort: "publishedAt:desc",
      },
      next: { revalidate: RESULT_CACHE_SECONDS },
    }),
    [],
  );
  const blog = posts.flatMap((post) =>
    post?.title && post.slug ? [{ label: post.title, href: `/blogs/${post.slug}`, detail: "Blog" }] : [],
  );

  return [...education, ...blog].slice(0, 2);
}

export async function quickSearch(query: string): Promise<QuickSearchResult> {
  const config = await getSearchConfig();
  const [products, categories, collections, articles] = await Promise.all([
    settle(searchProducts(query), []),
    settle(searchCategories(query), []),
    settle(searchCollections(query), []),
    searchArticles(query, config),
  ]);
  const services = toLinks(config?.serviceShortcuts)
    .filter((link) => keywordMatches(query, link.keywords))
    .map(({ label, href }) => ({ label, href }))
    .slice(0, 4);

  return {
    query,
    products,
    categories: [...categories, ...collections].slice(0, 4),
    articles,
    services,
  };
}

/** Curated popular searches (R-PS-1) first, then the most searched terms that found pieces. */
export async function searchSuggestions(): Promise<SearchSuggestions> {
  const [config, computed] = await Promise.all([
    getSearchConfig(),
    settle(
      magentoGraphqlFetch<{ sunnyPopularSearches?: (string | null)[] | null }>({
        query: POPULAR_QUERY,
        revalidateSeconds: CONFIG_CACHE_SECONDS,
      }),
      {},
    ),
  ]);

  const popular: SearchLink[] = toLinks(config?.popularSearches).map(({ label, href }) => ({ label, href }));
  const seen = new Set(popular.map((link) => link.label.toLowerCase()));
  for (const term of computed.sunnyPopularSearches ?? []) {
    const label = term?.trim();
    if (!label || seen.has(label.toLowerCase())) continue;
    seen.add(label.toLowerCase());
    popular.push({ label, href: searchResultsHref(label) });
  }

  return { popular: popular.slice(0, 8) };
}
