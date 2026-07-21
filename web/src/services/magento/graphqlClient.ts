import {
  getMagentoGraphqlUrl,
  MAGENTO_CATALOG_REVALIDATE_SECONDS,
  MAGENTO_DEFAULT_STORE_CODE,
} from "./config";
import { MagentoGraphqlError } from "./magento.errors";

export type MagentoGraphqlRequest = {
  query: string;
  variables?: Record<string, unknown>;
  signal?: AbortSignal;
  /** When false, skips Next.js fetch cache (client-side refresh). */
  cache?: RequestCache;
};

type MagentoGraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function magentoGraphqlFetch<T>({
  query,
  variables,
  signal,
  cache,
}: MagentoGraphqlRequest): Promise<T> {
  const isServer = typeof window === "undefined";
  const endpoint = isServer ? getMagentoGraphqlUrl() : "/api/magento/graphql";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Store: MAGENTO_DEFAULT_STORE_CODE,
    },
    body: JSON.stringify({ query, variables }),
    signal,
    cache: cache ?? (isServer ? "force-cache" : "default"),
    next: isServer ? { revalidate: MAGENTO_CATALOG_REVALIDATE_SECONDS } : undefined,
  });

  if (!response.ok) {
    throw new MagentoGraphqlError(`Magento GraphQL request failed (${response.status})`);
  }

  const json = (await response.json()) as MagentoGraphqlResponse<T>;

  if (json.errors?.length) {
    throw new MagentoGraphqlError(json.errors[0]?.message ?? "Magento GraphQL error", json.errors);
  }

  if (!json.data) {
    throw new MagentoGraphqlError("Magento GraphQL returned no data");
  }

  return json.data;
}
