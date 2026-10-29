import type { JewelleryListingProduct } from "../types";
import type { NormalizedProductListingCard } from "@/services/product-landing/product-landing-page.types";

export type JewelleryPlpGridItem =
  | { kind: "product"; product: JewelleryListingProduct; productIndex: number }
  | { kind: "listing-card"; card: NormalizedProductListingCard; segmentIndex: number };

export type JewelleryPlpViewport = "desktop" | "mobile";

const MD_BREAKPOINT = "(min-width: 768px)";

export function resolveListingCardPosition(
  card: NormalizedProductListingCard,
  viewport: JewelleryPlpViewport,
): number {
  return viewport === "desktop" ? card.desktopPosition : card.mobilePosition;
}

function buildCardsByPosition(
  listingCards: readonly NormalizedProductListingCard[],
  viewport: JewelleryPlpViewport,
): Map<number, NormalizedProductListingCard> {
  const cardsByPosition = new Map<number, NormalizedProductListingCard>();

  for (const card of listingCards) {
    const position = resolveListingCardPosition(card, viewport);
    if (position >= 1 && !cardsByPosition.has(position)) {
      cardsByPosition.set(position, card);
    }
  }

  return cardsByPosition;
}

/** Products consumed in slots before `slot` when promos occupy `promoPositions`. */
export function countProductsRequiredBeforeSlot(
  slot: number,
  promoPositions: readonly number[],
): number {
  const promosBefore = promoPositions.filter((position) => position < slot).length;
  return Math.max(0, slot - 1 - promosBefore);
}

export function filterEligibleListingCardPositions(
  promoPositions: readonly number[],
  segmentProductCount: number,
): number[] {
  const sorted = [...promoPositions].sort((a, b) => a - b);

  return sorted.filter(
    (position) =>
      countProductsRequiredBeforeSlot(position, sorted) <= segmentProductCount,
  );
}

function buildSegmentGridItems(
  segmentProducts: readonly JewelleryListingProduct[],
  globalProductOffset: number,
  cardsByPosition: Map<number, NormalizedProductListingCard>,
  eligiblePositions: readonly number[],
  segmentIndex: number,
): JewelleryPlpGridItem[] {
  if (segmentProducts.length === 0) {
    return [];
  }

  const segmentCards = new Map<number, NormalizedProductListingCard>();
  for (const position of eligiblePositions) {
    const card = cardsByPosition.get(position);
    if (card) {
      segmentCards.set(position, card);
    }
  }

  const items: JewelleryPlpGridItem[] = [];
  let localProductIndex = 0;
  let slot = 1;
  const maxPromoSlot = segmentCards.size ? Math.max(...segmentCards.keys()) : 0;

  while (localProductIndex < segmentProducts.length || slot <= maxPromoSlot) {
    const card = segmentCards.get(slot);
    if (card) {
      items.push({ kind: "listing-card", card, segmentIndex });
      slot += 1;
      continue;
    }

    if (localProductIndex < segmentProducts.length) {
      items.push({
        kind: "product",
        product: segmentProducts[localProductIndex]!,
        productIndex: globalProductOffset + localProductIndex,
      });
      localProductIndex += 1;
      slot += 1;
      continue;
    }

    break;
  }

  return items;
}

/**
 * Inserts CMS listing cards at 1-based grid slots per PLP pagination chunk (load-more page size).
 * Positions are relative to each chunk, not the accumulated product list.
 */
export function buildJewelleryPlpGridItems(
  products: readonly JewelleryListingProduct[],
  listingCards: readonly NormalizedProductListingCard[],
  viewport: JewelleryPlpViewport,
  pageSize?: number,
): JewelleryPlpGridItem[] {
  if (!products.length && !listingCards.length) {
    return [];
  }

  if (!products.length) {
    return [];
  }

  if (!listingCards.length) {
    return products.map((product, productIndex) => ({
      kind: "product" as const,
      product,
      productIndex,
    }));
  }

  const cardsByPosition = buildCardsByPosition(listingCards, viewport);
  const promoPositions = [...cardsByPosition.keys()].sort((a, b) => a - b);

  const effectivePageSize =
    pageSize != null && pageSize > 0 ? pageSize : products.length;

  const segmentCount = Math.ceil(products.length / effectivePageSize);
  const items: JewelleryPlpGridItem[] = [];

  for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex += 1) {
    const globalProductOffset = segmentIndex * effectivePageSize;
    const segmentProducts = products.slice(
      globalProductOffset,
      globalProductOffset + effectivePageSize,
    );
    const eligiblePositions = filterEligibleListingCardPositions(
      promoPositions,
      segmentProducts.length,
    );

    items.push(
      ...buildSegmentGridItems(
        segmentProducts,
        globalProductOffset,
        cardsByPosition,
        eligiblePositions,
        segmentIndex,
      ),
    );
  }

  return items;
}

export function readJewelleryPlpViewport(): JewelleryPlpViewport {
  if (typeof window === "undefined") {
    return "desktop";
  }

  return window.matchMedia(MD_BREAKPOINT).matches ? "desktop" : "mobile";
}
