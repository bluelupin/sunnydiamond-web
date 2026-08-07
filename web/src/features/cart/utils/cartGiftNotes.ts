import type { CartLineItem } from "../types/cart.types";

export type CartGiftNoteDisplay = {
  mode: "single" | "separate" | null;
  /** Shared note shown once above cart items in single-wrap mode. */
  globalNote: string | null;
};

export function isCartLineMarkedGift(item: CartLineItem): boolean {
  if (item.options.isGift === false) {
    return false;
  }

  return Boolean(item.options.isGift || item.gifting);
}

/** Derives how gift notes should render across the cart items list. */
export function resolveCartGiftNoteDisplay(items: CartLineItem[]): CartGiftNoteDisplay {
  const giftItems = items.filter(isCartLineMarkedGift);

  if (giftItems.length === 0) {
    return { mode: null, globalNote: null };
  }

  const hasSeparateWrap = giftItems.some((item) => item.gifting?.wrapMode === "separate");

  if (hasSeparateWrap) {
    return { mode: "separate", globalNote: null };
  }

  const globalNote =
    giftItems.map((item) => item.gifting?.note?.trim()).find((note) => Boolean(note)) ?? null;

  return {
    mode: globalNote ? "single" : null,
    globalNote,
  };
}

/** Item-level note — only populated in separate-wrap mode. */
export function getCartItemGiftNote(
  item: CartLineItem,
  display: CartGiftNoteDisplay,
): string | null {
  if (display.mode !== "separate" || !isCartLineMarkedGift(item)) {
    return null;
  }

  return item.gifting?.note?.trim() || null;
}
