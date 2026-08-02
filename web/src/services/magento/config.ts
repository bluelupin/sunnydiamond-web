const DEFAULT_MAGENTO_GRAPHQL_URL =
  "https://sunnydiamond-store-dev.on-forge.com/graphql";

export function getMagentoGraphqlUrl(): string {
  const raw = process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL?.trim();

  if (!raw) {
    return DEFAULT_MAGENTO_GRAPHQL_URL;
  }

  return raw.replace(/\/$/, "");
}

export const MAGENTO_DEFAULT_STORE_CODE =
  process.env.NEXT_PUBLIC_MAGENTO_STORE_CODE?.trim() || "default";

/** Server-side revalidation for Magento catalog reads (categories change infrequently). */
export const MAGENTO_CATALOG_REVALIDATE_SECONDS = Number(
  process.env.MAGENTO_CATALOG_REVALIDATE_SECONDS ?? 3600,
);

export function getMagentoRestBaseUrl(): string {
  return getMagentoGraphqlUrl().replace(/\/graphql$/, "");
}

export function getMagentoIntegrationAccessToken(): string | null {
  const token = process.env.MAGENTO_INTEGRATION_ACCESS_TOKEN?.trim();
  return token || null;
}
