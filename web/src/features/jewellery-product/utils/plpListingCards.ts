import type { JewelleryListingProduct } from "../types";
import type { NormalizedProductListingCard } from "@/services/product-landing/product-landing-page.types";

export type JewelleryPlpGridItem =
  | { kind: "product"; product: JewelleryListingProduct; productIndex: number }
  | { kind: "listing-card"; card: NormalizedProductListingCard };

export type JewelleryPlpViewport = "desktop" | "mobile";

const MD_BREAKPOINT = "(min-width: 768px)";

export function resolveListingCardPosition(
  card: NormalizedProductListingCard,
  viewport: JewelleryPlpViewport,
): number {
  return viewport === "desktop" ? card.desktopPosition : card.mobilePosition;
}

/** Inserts CMS listing cards at 1-based grid slots; products fill remaining slots in order. */
export function buildJewelleryPlpGridItems(
  products: readonly JewelleryListingProduct[],
  listingCards: readonly NormalizedProductListingCard[],
  viewport: JewelleryPlpViewport,
): JewelleryPlpGridItem[] {
  if (!products.length && !listingCards.length) {
    return [];
  }

  const cardsByPosition = new Map<number, NormalizedProductListingCard>();
  for (const card of listingCards) {
    const position = resolveListingCardPosition(card, viewport);
    if (position >= 1 && !cardsByPosition.has(position)) {
      cardsByPosition.set(position, card);
    }
  }

  const maxCardPosition = cardsByPosition.size
    ? Math.max(...cardsByPosition.keys())
    : 0;

  const items: JewelleryPlpGridItem[] = [];
  let productIndex = 0;
  let slot = 1;

  while (productIndex < products.length || slot <= maxCardPosition) {
    const card = cardsByPosition.get(slot);
    if (card) {
      items.push({ kind: "listing-card", card });
      slot += 1;
      continue;
    }

    if (productIndex < products.length) {
      items.push({
        kind: "product",
        product: products[productIndex]!,
        productIndex,
      });
      productIndex += 1;
      slot += 1;
      continue;
    }

    slot += 1;
  }

  return items;
}

export function readJewelleryPlpViewport(): JewelleryPlpViewport {
  if (typeof window === "undefined") {
    return "desktop";
  }

  return window.matchMedia(MD_BREAKPOINT).matches ? "desktop" : "mobile";
}
