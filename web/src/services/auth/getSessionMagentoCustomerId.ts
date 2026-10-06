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
): Promise<{ id: number; email: string; phone?: string } | null> {
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
        custom_attributes?: Array<{ code: string; value?: string | null }> | null;
        sd_mobile_verified?: boolean | null;
        sd_email_verified?: boolean | null;
      } | null;
    }>({
      query: MAGENTO_CUSTOMER_ME_QUERY,
      authToken: token,
    });

    const id = decodeMagentoEntityId(data.customer?.id ?? null);
    if (id === null) return null;
    // Only forward contact ownership proven by Magento, never browser contact fields.
    const customer = data.customer;
    const email = customer?.sd_email_verified === true && typeof customer.email === "string"
      ? customer.email.trim().toLowerCase() : "";
    const mobile = customer?.custom_attributes?.find(attribute => attribute.code === "mobile_number")?.value;
    const phone = customer?.sd_mobile_verified === true && typeof mobile === "string"
      ? mobile.trim() : undefined;
    return { id, email, ...(phone ? { phone } : {}) };
  } catch {
    return null;
  }
}

/** Compatibility helper for callers that only need the customer ID. */
export async function getSessionMagentoCustomerId(request?: Request): Promise<number | null> {
  return (await getSessionMagentoCustomerIdentity(request))?.id ?? null;
}
