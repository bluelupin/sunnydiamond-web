import type { CartLineItem } from "../types/cart.types";

export type GiftingFormState = {
  wrapMode: "single" | "separate";
  giftNote: string;
  itemNotes: Record<string, string>;
  selectedItemIds: string[];
};

export function isCartLineMarkedGift(item: CartLineItem): boolean {
  if (item.options.isGift === false) {
    return false;
  }

  return Boolean(item.options.isGift || item.gifting);
}

export function hasGiftMarkedCartItems(items: readonly CartLineItem[]): boolean {
  return items.some(isCartLineMarkedGift);
}

/** True when gifting was saved from the panel with at least one gift note. */
export function hasSavedGiftingNotes(items: readonly CartLineItem[]): boolean {
  return items.some(
    (item) =>
      Boolean(item.gifting?.wrapMode) &&
      Boolean(item.gifting?.note?.trim()),
  );
}

export function getGiftingOptionsCtaLabel(
  items: readonly CartLineItem[],
  hasConsumedGiftingEdit: boolean,
): "Personalise Your Gift" | "Edit Gifting Options" {
  if (hasSavedGiftingNotes(items) && !hasConsumedGiftingEdit) {
    return "Edit Gifting Options";
  }

  return "Personalise Your Gift";
}

/** Pre-check only lines already marked as gifts on the cart. */
export function getDefaultGiftingSelectedItemIds(items: readonly CartLineItem[]): string[] {
  return items.filter(isCartLineMarkedGift).map((item) => item.id);
}

export function buildGiftingFormStateFromItems(items: readonly CartLineItem[]): GiftingFormState {
  return {
    wrapMode: items.some((item) => item.gifting?.wrapMode === "separate") ? "separate" : "single",
    giftNote:
      items.find((item) => item.gifting?.wrapMode !== "separate" && item.gifting?.note)?.gifting
        ?.note ?? "",
    itemNotes: Object.fromEntries(
      items
        .filter((item) => item.gifting?.wrapMode === "separate" && item.gifting.note)
        .map((item) => [item.id, item.gifting?.note ?? ""]),
    ),
    selectedItemIds: getDefaultGiftingSelectedItemIds(items),
  };
}
