import { NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import { decodeMagentoEntityId } from "@/services/magento/decodeMagentoEntityId";
import { MAGENTO_CUSTOMER_ME_QUERY } from "@/services/customer/customer.gql";
import { clearCustomerTokenCookie, getCustomerToken } from "@/services/auth/session";

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

function isUnauthorizedMessage(message: string): boolean {
  return /isn'?t authorized|not authorized|unauthorized|authentication|login|token/i.test(
    message,
  );
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

    return NextResponse.json({
      customer: {
        id,
        firstname: customer.firstname,
        lastname: customer.lastname,
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
    if (isUnauthorizedMessage(message)) {
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
