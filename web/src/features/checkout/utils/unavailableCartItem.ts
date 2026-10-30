import type { CartLineItem } from "@/features/cart/types/cart.types";

const UNAVAILABLE_ITEM_MESSAGE =
  /\b(?:out of stock|insufficient stock|not enough items for sale|no source items with the in stock status|(?:product|item|sku|qty|quantity|stock).{0,160}(?:not available|unavailable|not salable|not saleable))\b/i;

export function isUnavailableCartError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const candidate = error as { message?: unknown; errors?: unknown };
  const messages = [candidate.message, ...(Array.isArray(candidate.errors)
    ? candidate.errors.map((entry: unknown) =>
        typeof entry === "object" && entry !== null && "message" in entry
          ? (entry as { message?: unknown }).message
          : null)
    : [])];
  return messages.some((message) =>
    typeof message === "string" && UNAVAILABLE_ITEM_MESSAGE.test(message),
  );
}

function mentionsIdentifier(message: string, identifier: string): boolean {
  const value = identifier.trim();
  if (!value) return false;

  const haystack = message.toLowerCase();
  const needle = value.toLowerCase();
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    const before = haystack[index - 1];
    const after = haystack[index + needle.length];
    if ((!before || !/[\p{L}\p{N}]/u.test(before)) &&
        (!after || !/[\p{L}\p{N}]/u.test(after))) {
      return true;
    }
    index = haystack.indexOf(needle, index + needle.length);
  }
  return false;
}

/** Only remove a cart line when Magento's stock error identifies it unambiguously. */
export function findUnavailableCartItem(
  error: unknown,
  items: readonly CartLineItem[],
): CartLineItem | null {
  if (typeof error !== "object" || error === null) return null;
  const candidate = error as { name?: unknown; message?: unknown; errors?: unknown };
  if (typeof candidate.message !== "string" || !isUnavailableCartError(error)) return null;
  const entries = Array.isArray(candidate.errors) ? candidate.errors : [];
  const messages = [candidate.message, ...entries.map((entry: unknown) =>
    typeof entry === "object" && entry !== null && "message" in entry
      ? (entry as { message?: unknown }).message
      : null,
  )]
    .filter((message): message is string => typeof message === "string")
    .filter((message) => UNAVAILABLE_ITEM_MESSAGE.test(message));
  if (messages.length === 0) return null;

  const matches = items.filter((item) =>
    messages.some((message) =>
      [item.product.productSku, item.product.id, item.product.name]
        .some((identifier) => identifier && mentionsIdentifier(message, identifier)),
    ),
  );

  if (matches.length === 1) return matches[0];
  if (matches.length === 0 && items.length === 1) return items[0];
  return null;
}
