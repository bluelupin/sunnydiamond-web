import type { CustomerAddress } from "./customer-account.types";
import type { CustomerProfileContact } from "./customer-profile.types";
import { formatCustomerFullName } from "@/shared/utils/customerName";

type AuthMePayload = {
  customer: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string | null;
  } | null;
};

function mapCountryCodeToPhonePrefix(countryCode: string): string {
  switch (countryCode.toUpperCase()) {
    case "US":
      return "+1";
    case "GB":
      return "+44";
    default:
      return "+91";
  }
}

function pickProfileAddressPhone(addresses: CustomerAddress[]): CustomerProfileContact | null {
  const preferred =
    addresses.find((address) => address.isDefaultShipping && address.phone.trim()) ??
    addresses.find((address) => address.phone.trim());

  if (!preferred) {
    return null;
  }

  return {
    phone: preferred.phone.replace(/\D/g, ""),
    countryCode: mapCountryCodeToPhonePrefix(preferred.countryCode),
  };
}

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

    const contact: CustomerProfileContact = {
      fullName: formatCustomerFullName(customer.firstname, customer.lastname) || null,
      email: customer.email ?? null,
      phone: null,
      countryCode: null,
    };

    // The account's own mobile number wins; the address-book phone is a fallback.
    const accountDigits = customer.phone?.replace(/\D/g, "") ?? "";
    if (accountDigits.length >= 10) {
      contact.phone = accountDigits.slice(-10);
      contact.countryCode = `+${accountDigits.slice(0, -10) || "91"}`;
      return contact;
    }

    try {
      const addressesResponse = await fetch("/api/customer/addresses", {
        cache: "no-store",
        signal,
      });

      if (addressesResponse.ok) {
        const { addresses } = (await addressesResponse.json()) as { addresses: CustomerAddress[] };
        const addressContact = pickProfileAddressPhone(addresses ?? []);

        if (addressContact?.phone) {
          contact.phone = addressContact.phone;
          contact.countryCode = addressContact.countryCode;
        }
      }
    } catch {
      // Address lookup is optional — name and email prefill still apply.
    }

    return contact;
  } catch {
    return null;
  }
}
