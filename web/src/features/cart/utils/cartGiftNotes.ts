import type { CartLineItem } from "../types/cart.types";
import type { StoredCartLineMetadata } from "@/services/magento/cart/cartSession";

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

function readGroupedGiftNoteFromMetadata(
  items: readonly CartLineItem[],
  lineMetadata: StoredCartLineMetadata,
): string {
  for (const item of items) {
    const gifting = lineMetadata[item.id]?.gifting;
    if (gifting?.wrapMode === "separate") {
      continue;
    }

    const note = gifting?.note?.trim();
    if (note) {
      return note;
    }
  }

  return "";
}

function readSeparateGiftNotesFromMetadata(
  items: readonly CartLineItem[],
  lineMetadata: StoredCartLineMetadata,
): Record<string, string> {
  const notes: Record<string, string> = {};

  for (const item of items) {
    const note = lineMetadata[item.id]?.gifting?.note?.trim();
    if (note) {
      notes[item.id] = note;
    }
  }

  return notes;
}

/** Grouped (single-bag) gift note from cart lines, with localStorage metadata fallback. */
export function resolveGroupedGiftNoteFromCart(
  items: readonly CartLineItem[],
  lineMetadata: StoredCartLineMetadata = {},
): string {
  const fromItems =
    items.find(
      (item) => item.gifting?.wrapMode !== "separate" && item.gifting?.note?.trim(),
    )?.gifting?.note?.trim() ?? "";

  if (fromItems) {
    return fromItems;
  }

  return readGroupedGiftNoteFromMetadata(items, lineMetadata);
}

export function buildGiftingFormStateFromItems(
  items: readonly CartLineItem[],
  lineMetadata: StoredCartLineMetadata = {},
): GiftingFormState {
  const wrapMode = items.some((item) => item.gifting?.wrapMode === "separate")
    ? "separate"
    : "single";

  const itemNotesFromItems = Object.fromEntries(
    items
      .filter((item) => item.gifting?.wrapMode === "separate" && item.gifting.note)
      .map((item) => [item.id, item.gifting?.note ?? ""]),
  );
  const itemNotesFromMetadata = readSeparateGiftNotesFromMetadata(items, lineMetadata);

  return {
    wrapMode,
    giftNote: resolveGroupedGiftNoteFromCart(items, lineMetadata),
    itemNotes: { ...itemNotesFromMetadata, ...itemNotesFromItems },
    selectedItemIds: getDefaultGiftingSelectedItemIds(items),
  };
}
