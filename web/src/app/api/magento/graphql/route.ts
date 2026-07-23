import { NextRequest, NextResponse } from "next/server";
import {
  getMagentoGraphqlUrl,
  MAGENTO_CATALOG_REVALIDATE_SECONDS,
  MAGENTO_DEFAULT_STORE_CODE,
} from "@/services/magento/config";
import { CUSTOMER_TOKEN_COOKIE } from "@/services/auth/session";

type GraphqlBody = {
  query?: string;
  variables?: Record<string, unknown>;
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
    /\b(cart\s*\(|customerCart|createGuestCart|addSimpleProductsToCart|addProductsToCart|updateCartItems|removeItemFromCart|setGuestEmailOnCart|setShippingAddressesOnCart|setBillingAddressOnCart|setShippingMethodsOnCart|setPaymentMethodOnCart|placeOrder|estimateShippingMethods)\b/.test(
      query,
    );

  const customerToken = request.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value;

  try {
    const response = await fetch(getMagentoGraphqlUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Store: MAGENTO_DEFAULT_STORE_CODE,
        ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
      },
      body: JSON.stringify({ query: body.query, variables: body.variables }),
      ...(isCartOperation || customerToken
        ? { cache: "no-store" as const }
        : { next: { revalidate: MAGENTO_CATALOG_REVALIDATE_SECONDS } }),
    });

    const json = await response.json();

    return NextResponse.json(json, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Magento GraphQL proxy failed" }, { status: 502 });
  }
}
