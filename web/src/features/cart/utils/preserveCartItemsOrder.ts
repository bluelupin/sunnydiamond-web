import type { CartLineItem } from "@/features/cart/types/cart.types";

const LINE_INSTANCE_KEY_PREFIX = "li:";
const LINE_UID_KEY_PREFIX = "uid:";

/** Stable across Magento cart-item uid rotation when lineInstance is set. */
export function resolveCartLineOrderKey(item: CartLineItem): string {
  const lineInstance = item.options.lineInstance?.trim();
  if (lineInstance) {
    return `${LINE_INSTANCE_KEY_PREFIX}${lineInstance}`;
  }

  return `${LINE_UID_KEY_PREFIX}${item.id}`;
}

export function buildCartLineOrderKeys(items: CartLineItem[]): string[] {
  return items.map((item) => resolveCartLineOrderKey(item));
}

function itemMatchesOrderKey(item: CartLineItem, key: string): boolean {
  if (key.startsWith(LINE_INSTANCE_KEY_PREFIX)) {
    return item.options.lineInstance?.trim() === key.slice(LINE_INSTANCE_KEY_PREFIX.length);
  }

  if (key.startsWith(LINE_UID_KEY_PREFIX)) {
    return item.id === key.slice(LINE_UID_KEY_PREFIX.length);
  }

  return false;
}

/** Restore UI order after a full page load when React state is empty. */
export function preserveCartItemsOrderByKeys(
  orderKeys: readonly string[],
  nextItems: CartLineItem[],
): CartLineItem[] {
  if (orderKeys.length === 0 || nextItems.length === 0) {
    return nextItems;
  }

  const unusedNext = [...nextItems];
  const ordered: CartLineItem[] = [];

  for (const key of orderKeys) {
    const index = unusedNext.findIndex((item) => itemMatchesOrderKey(item, key));
    if (index < 0) {
      continue;
    }

    ordered.push(unusedNext[index]!);
    unusedNext.splice(index, 1);
  }

  for (const item of unusedNext) {
    ordered.push(item);
  }

  return ordered.length === nextItems.length ? ordered : nextItems;
}

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
