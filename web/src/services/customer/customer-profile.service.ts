import type { CustomerProfileContact } from "./customer-profile.types";

type AuthMePayload = {
  customer: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  } | null;
};

/**
 * Fetches the signed-in customer's profile contact details via the session
 * cookie. Returns `null` for guests — safe to call from forms.
 */
export async function getCustomerProfileContact(
  signal?: AbortSignal,
): Promise<CustomerProfileContact | null> {
  try {
    const response = await fetch("/api/auth/me", { cache: "no-store", signal });
    if (!response.ok) {
      return null;
    }

    const { customer } = (await response.json()) as AuthMePayload;
    if (!customer) {
      return null;
    }

    return {
      fullName: [customer.firstname, customer.lastname].filter(Boolean).join(" ") || null,
      email: customer.email ?? null,
      phone: null,
      countryCode: null,
    };
  } catch {
    return null;
  }
}
