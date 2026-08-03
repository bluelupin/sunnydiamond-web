import { magentoGraphqlFetch } from "../graphqlClient";
import { MAGENTO_PRODUCT_ATTRIBUTE_OPTIONS_QUERY } from "./productAttributeOptions.query";
import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";

type MagentoProductAttributeOptionsResponse = {
  customAttributeMetadata?: {
    items?: Array<{
      attribute_code?: string | null;
      attribute_options?: Array<{
        label?: string | null;
        value?: string | null;
      }> | null;
    }> | null;
  } | null;
};

type AttributeOptionsCacheEntry = {
  value?: JewelleryFilterFacetOption[];
  promise?: Promise<JewelleryFilterFacetOption[]>;
  fetchedAt: number;
};

const ATTRIBUTE_OPTIONS_CACHE_TTL_MS = 10 * 60 * 1000;
const attributeOptionsCache = new Map<string, AttributeOptionsCacheEntry>();

function mapAttributeOptions(
  response: MagentoProductAttributeOptionsResponse,
  attributeCode: string,
): JewelleryFilterFacetOption[] {
  const items = response.customAttributeMetadata?.items ?? [];
  const attributeItem =
    items.find((item) => item.attribute_code === attributeCode) ?? items[0];

  return (attributeItem?.attribute_options ?? [])
    .map((option) => ({
      label: option.label?.trim() ?? "",
      value: option.value?.trim() ?? "",
    }))
    .filter((option) => option.label.length > 0 && option.value.length > 0);
}

async function fetchMagentoProductAttributeOptions(
  attributeCode: string,
  signal?: AbortSignal,
): Promise<JewelleryFilterFacetOption[]> {
  const data = await magentoGraphqlFetch<MagentoProductAttributeOptionsResponse>({
    query: MAGENTO_PRODUCT_ATTRIBUTE_OPTIONS_QUERY,
    variables: {
      attributes: [{ attribute_code: attributeCode, entity_type: "catalog_product" }],
    },
    signal,
    cache: "force-cache",
  });

  return mapAttributeOptions(data, attributeCode);
}

/** Live Magento select/dropdown options for a product attribute (e.g. `sd_occasions`). */
export async function getMagentoProductAttributeOptions(
  attributeCode: string,
  signal?: AbortSignal,
): Promise<JewelleryFilterFacetOption[]> {
  const code = attributeCode.trim();
  if (!code) {
    return [];
  }

  if (typeof window !== "undefined") {
    const cached = attributeOptionsCache.get(code);
    if (
      cached?.value &&
      Date.now() - cached.fetchedAt < ATTRIBUTE_OPTIONS_CACHE_TTL_MS
    ) {
      return cached.value;
    }
    if (cached?.promise) {
      return cached.promise;
    }
  }

  const fetchPromise = fetchMagentoProductAttributeOptions(code, signal);

  if (typeof window !== "undefined") {
    const existing = attributeOptionsCache.get(code);
    attributeOptionsCache.set(code, {
      value: existing?.value,
      promise: fetchPromise,
      fetchedAt: existing?.fetchedAt ?? 0,
    });
  }

  try {
    const options = await fetchPromise;
    if (typeof window !== "undefined") {
      attributeOptionsCache.set(code, {
        value: options,
        promise: undefined,
        fetchedAt: Date.now(),
      });
    }
    return options;
  } catch (error) {
    if (typeof window !== "undefined") {
      const existing = attributeOptionsCache.get(code);
      attributeOptionsCache.set(code, {
        value: existing?.value,
        promise: undefined,
        fetchedAt: existing?.fetchedAt ?? 0,
      });
    }
    throw error;
  }
}

export function mergeFacetOptions(
  primary: readonly JewelleryFilterFacetOption[],
  fallback: readonly JewelleryFilterFacetOption[],
): JewelleryFilterFacetOption[] {
  if (fallback.length === 0) {
    return [...primary];
  }
  if (primary.length === 0) {
    return [...fallback];
  }

  const byValue = new Map<string, JewelleryFilterFacetOption>();
  for (const option of fallback) {
    byValue.set(option.value, option);
  }
  for (const option of primary) {
    byValue.set(option.value, option);
  }
  return Array.from(byValue.values());
}
