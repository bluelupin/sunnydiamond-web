import { NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MAGENTO_REVOKE_CUSTOMER_TOKEN_MUTATION } from "@/services/customer/customer.gql";
import { clearCustomerTokenCookie, getCustomerToken } from "@/services/auth/session";

export async function POST() {
  const token = await getCustomerToken();

  if (token) {
    try {
      await magentoGraphqlFetch({
        query: MAGENTO_REVOKE_CUSTOMER_TOKEN_MUTATION,
        authToken: token,
      });
    } catch {
      // Cookie is cleared regardless — an expired/invalid token cannot be revoked anyway.
    }
  }

  await clearCustomerTokenCookie();
  return NextResponse.json({ ok: true });
}
