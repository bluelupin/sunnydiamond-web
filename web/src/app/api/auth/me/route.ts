import { NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import { decodeMagentoEntityId } from "@/services/magento/decodeMagentoEntityId";
import { MAGENTO_CUSTOMER_ME_QUERY } from "@/services/customer/customer.gql";
import { clearCustomerTokenCookie, getCustomerToken } from "@/services/auth/session";
import { mapMagentoCustomerNameForClient } from "@/shared/utils/customerName";

export type AuthMeResponse = {
  customer: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  } | null;
  /** Present when customer is null — useful in Network tab while debugging auth. */
  reason?: string;
};

/**
 * Only a genuine authorization failure may delete the session cookie. Magento
 * tags those `graphql-authorization`; the message fallback is deliberately
 * narrow — the old broad regex (authentication|login|token) matched unrelated
 * Magento errors and destroyed valid sessions on transient failures (QA bug #18).
 */
function isAuthorizationFailure(error: unknown, message: string): boolean {
  if (
    error instanceof MagentoGraphqlError &&
    error.errors.some(
      (entry) =>
        entry.extensions?.category === "graphql-authorization" ||
        entry.extensions?.category === "graphql-authentication",
    )
  ) {
    return true;
  }

  // An expired/revoked token makes Magento answer HTTP 401 before GraphQL runs;
  // the client surfaces that as "... request failed (401)" with no error entries.
  return /isn'?t authorized|not authorized|unauthorized/i.test(message) || /\(401\)$/.test(message);
}

export async function GET() {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({
      customer: null,
      reason: "no_session",
    } satisfies AuthMeResponse);
  }

  try {
    const data = await magentoGraphqlFetch<{
      customer: {
        id: number | string;
        firstname: string;
        lastname: string;
        email: string;
      };
    }>({
      query: MAGENTO_CUSTOMER_ME_QUERY,
      authToken: token,
    });

    const customer = data.customer;
    if (!customer) {
      await clearCustomerTokenCookie();
      return NextResponse.json({
        customer: null,
        reason: "empty_customer",
      } satisfies AuthMeResponse);
    }

    const id = decodeMagentoEntityId(customer.id);
    if (id == null) {
      return NextResponse.json(
        {
          customer: null,
          reason: `Invalid customer id: ${String(customer.id)}`,
        } satisfies AuthMeResponse,
        { status: 502 },
      );
    }

    const { firstname, lastname } = mapMagentoCustomerNameForClient(
      customer.firstname,
      customer.lastname,
    );

    return NextResponse.json({
      customer: {
        id,
        firstname,
        lastname,
        email: customer.email,
      },
    } satisfies AuthMeResponse);
  } catch (error) {
    const message =
      error instanceof MagentoGraphqlError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Failed to load customer";

    // Only drop the session for real auth failures — not schema/network blips.
    if (isAuthorizationFailure(error, message)) {
      await clearCustomerTokenCookie();
      return NextResponse.json({
        customer: null,
        reason: message,
      } satisfies AuthMeResponse);
    }

    return NextResponse.json(
      {
        customer: null,
        reason: message,
      } satisfies AuthMeResponse,
      { status: 502 },
    );
  }
}
