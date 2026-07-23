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
  /** Magento customer token; forces no-store and adds Authorization header. Server-side only. */
  authToken?: string;
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
  authToken,
}: MagentoGraphqlRequest): Promise<T> {
  const isServer = typeof window === "undefined";
  const endpoint = isServer ? getMagentoGraphqlUrl() : "/api/magento/graphql";
  const effectiveCache = authToken ? "no-store" : cache;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Store: MAGENTO_DEFAULT_STORE_CODE,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
    signal,
    cache: effectiveCache ?? (isServer ? "force-cache" : "default"),
    ...(isServer && effectiveCache !== "no-store"
      ? { next: { revalidate: MAGENTO_CATALOG_REVALIDATE_SECONDS } }
      : {}),
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
