import { NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MAGENTO_CUSTOMER_ME_QUERY } from "@/services/customer/customer.gql";
import { clearCustomerTokenCookie, getCustomerToken } from "@/services/auth/session";

export type AuthMeResponse = {
  customer: {
    firstname: string;
    lastname: string;
    email: string;
  } | null;
};

export async function GET() {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ customer: null } satisfies AuthMeResponse);
  }

  try {
    const data = await magentoGraphqlFetch<{
      customer: { firstname: string; lastname: string; email: string };
    }>({
      query: MAGENTO_CUSTOMER_ME_QUERY,
      authToken: token,
    });

    return NextResponse.json({ customer: data.customer } satisfies AuthMeResponse);
  } catch {
    // Expired or revoked token — drop the stale cookie.
    await clearCustomerTokenCookie();
    return NextResponse.json({ customer: null } satisfies AuthMeResponse);
  }
}
