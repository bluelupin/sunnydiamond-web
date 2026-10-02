import type { CartLineItem } from "@/features/cart/types/cart.types";

function removeFromList(list: CartLineItem[], item: CartLineItem): void {
  const index = list.findIndex((candidate) => candidate.id === item.id);
  if (index >= 0) {
    list.splice(index, 1);
  }
}

/**
 * Magento often returns cart lines in a different order after an option update
 * because the cart item uid rotates. Keep the UI order stable by matching each
 * previous line to its successor in the fresh response.
 */
export function preserveCartItemsOrder(
  previousItems: CartLineItem[],
  nextItems: CartLineItem[],
): CartLineItem[] {
  if (previousItems.length === 0 || nextItems.length === 0) {
    return nextItems;
  }

  const nextById = new Map(nextItems.map((item) => [item.id, item]));
  const previousIds = new Set(previousItems.map((item) => item.id));
  const unusedNext = [...nextItems];
  const ordered: CartLineItem[] = [];

  for (const previous of previousItems) {
    const direct = nextById.get(previous.id);
    if (direct) {
      ordered.push(direct);
      removeFromList(unusedNext, direct);
      continue;
    }

    const previousLineInstance = previous.options.lineInstance?.trim();
    if (previousLineInstance) {
      const byLineInstance = unusedNext.find(
        (item) => item.options.lineInstance?.trim() === previousLineInstance,
      );
      if (byLineInstance) {
        ordered.push(byLineInstance);
        removeFromList(unusedNext, byLineInstance);
        continue;
      }
    }

    const sameProductCandidates = unusedNext.filter(
      (item) =>
        item.product.id === previous.product.id && item.quantity === previous.quantity,
    );
    const rotatedCandidate =
      sameProductCandidates.length === 1
        ? sameProductCandidates[0]
        : sameProductCandidates.find((item) => !previousIds.has(item.id));

    if (rotatedCandidate) {
      ordered.push(rotatedCandidate);
      removeFromList(unusedNext, rotatedCandidate);
    }
  }

  for (const item of unusedNext) {
    ordered.push(item);
  }

  return ordered.length === nextItems.length ? ordered : nextItems;
}
