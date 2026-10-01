import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { decodeMagentoEntityId } from "@/services/magento/decodeMagentoEntityId";
import { MAGENTO_CUSTOMER_ME_QUERY } from "@/services/customer/customer.gql";
import { getCustomerToken, getCustomerTokenFromRequest } from "./session";

/**
 * Resolve the logged-in Magento customer identity from the httpOnly session cookie.
 * Used by appointment BFFs so the browser never supplies a trusted customer id.
 */
export async function getSessionMagentoCustomerIdentity(
  request?: Request,
): Promise<{ id: number; email: string } | null> {
  const token = request
    ? await getCustomerTokenFromRequest(request)
    : await getCustomerToken();

  if (!token) {
    return null;
  }

  try {
    const data = await magentoGraphqlFetch<{
      customer: {
        id: number | string;
        email: string;
      } | null;
    }>({
      query: MAGENTO_CUSTOMER_ME_QUERY,
      authToken: token,
    });

    const id = decodeMagentoEntityId(data.customer?.id ?? null);
    if (id === null) return null;
    // Magento verifies account email ownership; never use browser contact fields here.
    const email = typeof data.customer?.email === "string"
      ? data.customer.email.trim().toLowerCase() : "";
    return { id, email };
  } catch {
    return null;
  }
}

/** Compatibility helper for callers that only need the customer ID. */
export async function getSessionMagentoCustomerId(request?: Request): Promise<number | null> {
  return (await getSessionMagentoCustomerIdentity(request))?.id ?? null;
}
