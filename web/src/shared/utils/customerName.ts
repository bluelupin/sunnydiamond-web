/** Magento requires lastname; one-word names are stored as this placeholder and must never be shown. */
export const PLACEHOLDER_CUSTOMER_LAST_NAME = "-";

export function isPlaceholderCustomerLastName(value?: string | null): boolean {
  const trimmed = value?.replace(/\u00A0/g, " ").trim() ?? "";
  return !trimmed || /^[-–—−]+$/.test(trimmed);
}

function namePartsFromValues(...values: Array<string | null | undefined>): string[] {
  return values
    .flatMap((value) => (value ?? "").replace(/\u00A0/g, " ").trim().split(/\s+/))
    .filter((part) => part && !isPlaceholderCustomerLastName(part));
}

/** Display/edit name. Strips Magento's required lastname placeholder so "Naaz" never becomes "Naaz -". */
export function formatCustomerFullName(
  firstname?: string | null,
  lastname?: string | null,
): string {
  return namePartsFromValues(firstname, lastname).join(" ");
}

function splitStoredCustomerName(
  fullName: string,
  emptyFirstName: string,
): { firstname: string; lastname: string } {
  const parts = namePartsFromValues(fullName);

  if (parts.length === 0) {
    return { firstname: emptyFirstName, lastname: PLACEHOLDER_CUSTOMER_LAST_NAME };
  }

  if (parts.length === 1) {
    return { firstname: parts[0], lastname: PLACEHOLDER_CUSTOMER_LAST_NAME };
  }

  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(" "),
  };
}

export function splitProfileFullName(fullName: string): { firstname: string; lastname: string } {
  return splitStoredCustomerName(fullName, "");
}

/** Magento address/customer payloads. Empty names become Guest / placeholder lastname. */
export function splitFullName(fullName: string): { firstname: string; lastname: string } {
  return splitStoredCustomerName(fullName, "Guest");
}

/** Client-facing Magento name. Placeholder lastname is dropped so joins never show "Naaz -". */
export function mapMagentoCustomerNameForClient(
  firstname?: string | null,
  lastname?: string | null,
): { firstname: string; lastname: string } {
  const parts = namePartsFromValues(firstname, lastname);

  if (parts.length === 0) {
    return { firstname: "", lastname: "" };
  }

  if (parts.length === 1) {
    return { firstname: parts[0], lastname: "" };
  }

  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(" "),
  };
}

export function sanitizeAuthCustomer<T extends { firstname: string; lastname: string }>(
  customer: T,
): T {
  return {
    ...customer,
    ...mapMagentoCustomerNameForClient(customer.firstname, customer.lastname),
  };
}
