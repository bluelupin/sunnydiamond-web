import { buildProfileOrderDetailHref } from "@/features/account/utils/profileOrderNavigation";

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

/**
 * Success screen primary button. Digital cards are emailed, so there is nothing to track:
 * View Details opens the order in My Orders (every gift card buyer is signed in). Physical
 * cards keep the Track Order page.
 */
export function giftCardSuccessHref(cardType: "digital" | "physical", orderNumber: string): string {
  const number = orderNumber.trim();
  if (cardType === "digital") {
    return number ? buildProfileOrderDetailHref(number) : "/profile?section=orders";
  }
  return number ? `/order-tracking?order=${encodeURIComponent(number)}` : "/order-tracking";
}
