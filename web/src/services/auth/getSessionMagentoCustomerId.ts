import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { decodeMagentoEntityId } from "@/services/magento/decodeMagentoEntityId";
import { MAGENTO_CUSTOMER_ME_QUERY } from "@/services/customer/customer.gql";
import { getCustomerToken, getCustomerTokenFromRequest } from "./session";

/**
 * Resolve the logged-in Magento customer id from the httpOnly session cookie.
 * Used by appointment BFFs so the browser never supplies a trusted customer id.
 */
export async function getSessionMagentoCustomerId(
  request?: Request,
): Promise<number | null> {
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
      } | null;
    }>({
      query: MAGENTO_CUSTOMER_ME_QUERY,
      authToken: token,
    });

    return decodeMagentoEntityId(data.customer?.id ?? null);
  } catch {
    return null;
  }
}
