import { NextRequest, NextResponse } from "next/server";
import {
  getMagentoGraphqlUrl,
  MAGENTO_CATALOG_REVALIDATE_SECONDS,
  MAGENTO_DEFAULT_STORE_CODE,
} from "@/services/magento/config";
import { CUSTOMER_TOKEN_COOKIE } from "@/services/auth/session";
import { resolveClientIp } from "@/services/http/clientIp";
import {
  MAGENTO_JEWELLERY_LATEST_PRODUCTS_LEGACY_QUERY,
  MAGENTO_JEWELLERY_LATEST_PRODUCTS_QUERY,
  MAGENTO_JEWELLERY_PRODUCT_FACETS_QUERY,
  MAGENTO_JEWELLERY_PRODUCTS_QUERY,
} from "@/services/magento/products/products.query";
import { MAGENTO_PRODUCT_BY_URL_KEY_QUERY } from "@/services/magento/products/productDetail.query";

type GraphqlBody = {
  query?: string;
  variables?: Record<string, unknown>;
  preferGet?: boolean;
};

export async function POST(request: NextRequest) {
  let body: GraphqlBody;

  try {
    body = (await request.json()) as GraphqlBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.query?.trim()) {
    return NextResponse.json({ error: "Missing GraphQL query" }, { status: 400 });
  }

  const query = body.query;
  const isCartOperation =
    /\b(cart\s*\(|customerCart|createGuestCart|addSimpleProductsToCart|addProductsToCart|updateCartItems|removeItemFromCart|setGuestEmailOnCart|setShippingAddressesOnCart|setBillingAddressOnCart|setShippingMethodsOnCart|setPaymentMethodOnCart|placeOrder|estimateShippingMethods|sunnyApplyGiftCard|sunnyRemoveGiftCard)\b/.test(
      query,
    );

  const customerToken = request.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value;
  const publicCatalogQuery = [
    MAGENTO_JEWELLERY_PRODUCTS_QUERY,
    MAGENTO_JEWELLERY_LATEST_PRODUCTS_QUERY,
    MAGENTO_JEWELLERY_LATEST_PRODUCTS_LEGACY_QUERY,
    MAGENTO_JEWELLERY_PRODUCT_FACETS_QUERY,
    MAGENTO_PRODUCT_BY_URL_KEY_QUERY,
  ].some((allowedQuery) => allowedQuery === query);
  const params = new URLSearchParams({ query });
  if (body.variables) params.set("variables", JSON.stringify(body.variables));
  const getUrl = `${getMagentoGraphqlUrl()}?${params.toString()}`;
  const useGet = body.preferGet === true && publicCatalogQuery && !customerToken
    && !isCartOperation && getUrl.length < 8000;

  // Gift card attempts are rate-limited per shopper IP in Magento. Same contract as
  // the OTP route: the IP only counts when it travels with the shared secret, so a
  // missing secret degrades to one shared bucket, never to none. Server-side only.
  const clientIp = /\bsunnyApplyGiftCard\b/.test(query) ? resolveClientIp(request) : null;
  const forwardedSecret = process.env.MAGENTO_FORWARDED_IP_SECRET;
  const forwardedHeaders: Record<string, string> =
    clientIp && forwardedSecret
      ? {
          "X-Sunny-Client-Ip": clientIp,
          "X-Sunny-Forwarded-Secret": forwardedSecret,
        }
      : {};

  const buildMagentoHeaders = (includeCustomerToken: boolean) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Store: MAGENTO_DEFAULT_STORE_CODE,
    ...(includeCustomerToken && customerToken
      ? { Authorization: `Bearer ${customerToken}` }
      : {}),
    ...forwardedHeaders,
    // Search-results pagination and facets must not count as searches (SunnyDiamonds_QuickSearch).
    ...(request.headers.get("x-sunny-search-mode") === "suggest"
      ? { "X-Sunny-Search-Mode": "suggest" }
      : {}),
  });

  const fetchMagento = (includeCustomerToken: boolean) =>
    fetch(useGet ? getUrl : getMagentoGraphqlUrl(), {
      method: useGet ? "GET" : "POST",
      headers: buildMagentoHeaders(includeCustomerToken),
      ...(!useGet ? { body: JSON.stringify({ query: body.query, variables: body.variables }) } : {}),
      ...(isCartOperation || customerToken
        ? { cache: "no-store" as const }
        : { next: { revalidate: MAGENTO_CATALOG_REVALIDATE_SECONDS } }),
    });

  try {
    let response = await fetchMagento(Boolean(customerToken));

    // Stale session cookies break guest-cart calls (cart_id is its own credential).
    // Retry once without Authorization before surfacing 403 to the browser.
    if (response.status === 403 && customerToken) {
      response = await fetchMagento(false);
    }

    const json = await response.json();

    return NextResponse.json(json, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Magento GraphQL proxy failed" }, { status: 502 });
  }
}
