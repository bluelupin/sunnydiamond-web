/** Guest quote missing, inactive, or forbidden — safe to discard local cart id. */
export function isGuestCartUnavailableError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("message" in error) ||
      typeof error.message !== "string") return false;
  const entries = "errors" in error && Array.isArray(error.errors) ? error.errors : [];
  return (
    /could not find a cart|cart.*(?:isn't|is not|not) active|current user cannot perform|customerCart/i.test(
      error.message,
    ) ||
    /\(403\)$/.test(error.message) ||
    entries.some((entry: unknown) =>
      typeof entry === "object" && entry !== null && "extensions" in entry &&
      typeof entry.extensions === "object" && entry.extensions !== null &&
      "category" in entry.extensions && entry.extensions.category === "graphql-authorization")
  );
}
