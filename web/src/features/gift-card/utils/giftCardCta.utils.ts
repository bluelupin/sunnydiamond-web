const GIFT_CARD_PATH_PATTERN = /(^|\/)gift-card(\/|$|\?|#)/i;
const GIFT_CARD_HASH_PATTERN = /#gift-card/i;

export function isGiftCardFlowCtaUrl(url: string | null | undefined): boolean {
  const normalized = url?.trim();
  if (!normalized) return false;

  if (GIFT_CARD_PATH_PATTERN.test(normalized)) return true;
  if (GIFT_CARD_HASH_PATTERN.test(normalized)) return true;

  try {
    const parsed = new URL(normalized, "https://sunnydiamonds.local");
    if (parsed.pathname === "/gift-card") return true;
    if (parsed.hash.includes("gift-card")) return true;
  } catch {
    return false;
  }

  return false;
}

export function isGiftCardFlowCtaLabel(label: string | null | undefined): boolean {
  const normalized = label?.trim().toLowerCase() ?? "";
  if (!normalized) return false;
  return normalized.includes("gift card");
}
