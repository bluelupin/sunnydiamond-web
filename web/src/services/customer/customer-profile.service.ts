import type { CustomerProfileContact } from "./customer-profile.types";

/**
 * Fetches the signed-in customer's profile contact details.
 *
 * Backend My Profile is not available yet — this returns `null` and is safe
 * to call from forms. When the API lands, implement the fetch here only;
 * Book a Visit / other forms already consume this contract.
 */
export async function getCustomerProfileContact(
  _signal?: AbortSignal,
): Promise<CustomerProfileContact | null> {
  // TODO(my-profile): replace with authenticated GET (e.g. /api/customer/me or /api/profile)
  // and map the response into CustomerProfileContact.
  return null;
}
