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

/**
 * PLP cards show Magento `final_price` (incl. tax). Catalog search `price`
 * filters use the indexed excl-tax amount. Sunny Diamonds jewellery GST is 3%,
 * so display÷1.03 matches the filter index (verified on Diya ring, etc.).
 */
export function getMagentoPriceFilterTaxMultiplier(): number {
  const raw = Number(process.env.NEXT_PUBLIC_MAGENTO_PRICE_FILTER_TAX_MULTIPLIER ?? "1.03");
  return Number.isFinite(raw) && raw > 0 ? raw : 1.03;
}

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

/**
 * `sunnySubscribeStockAlert` only exists once SunnyDiamonds_TransactionalEmail is
 * deployed, and GraphQL hard-fails on unknown fields — so the notify-me flow stays
 * dark until `MAGENTO_STOCK_ALERT=true` (same deploy-gating idiom as
 * `MAGENTO_ORDER_FLOW_FIELDS`). Intentionally not `NEXT_PUBLIC_`: the PDP server
 * component and the stock-alert route handler are the only readers.
 */
export function isMagentoStockAlertEnabled(): boolean {
  return process.env.MAGENTO_STOCK_ALERT === "true";
}
