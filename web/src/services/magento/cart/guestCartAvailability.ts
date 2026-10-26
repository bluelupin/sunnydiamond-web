import { MagentoGraphqlError } from "../magento.errors";

/** Guest quote missing, inactive, or forbidden — safe to discard local cart id (same as add-to-bag). */
export function isGuestCartUnavailableError(error: unknown): boolean {
  if (!(error instanceof MagentoGraphqlError)) {
    return false;
  }

  return (
    /could not find a cart|cart.*(?:isn't|is not|not) active|current user cannot perform|customerCart/i.test(
      error.message,
    ) ||
    /\(403\)$/.test(error.message) ||
    error.errors.some((entry) => entry.extensions?.category === "graphql-authorization")
  );
}
