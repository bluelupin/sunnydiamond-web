import type { CustomerOrderItemOption } from "@/services/customer/customer-account.types";

function normalizeKey(text: string): string {
  return text.trim().toLowerCase();
}

function isTruthyGiftValue(value: string): boolean {
  const normalized = normalizeKey(value);

  return (
    normalized === "yes" ||
    normalized === "true" ||
    normalized === "1" ||
    normalized.includes("gift wrap") ||
    normalized === "gift"
  );
}

function isGiftOptionLabel(label: string): boolean {
  const normalized = normalizeKey(label);

  if (normalized.includes("gift card")) {
    return false;
  }

  return (
    normalized.includes("gift") ||
    normalized.includes("is_gift") ||
    normalized.includes("gift wrap") ||
    normalized.includes("giftwrap")
  );
}

const LINE_METADATA_LINE_PATTERN = /^-\s+(.+?)\s+\(([^)]+)\):\s*(.+)$/;
const GIFT_NOTE_PATTERN = /Gift note:\s*"([^"]+)"/i;

export type OrderGiftMetadata = {
  giftedProductNames: Set<string>;
  giftedProductSkus: Set<string>;
  giftNotes: Map<string, string>;
};

const EMPTY_GIFT_METADATA: OrderGiftMetadata = {
  giftedProductNames: new Set(),
  giftedProductSkus: new Set(),
  giftNotes: new Map(),
};

function isGiftDetails(details: string): boolean {
  return details.includes("Gift wrap: Yes") || normalizeKey(details).includes("gift wrap");
}

function storeGiftNote(
  notes: Map<string, string>,
  keys: string[],
  note: string,
): void {
  for (const key of keys) {
    const normalized = normalizeKey(key);
    if (normalized) {
      notes.set(normalized, note);
    }
  }
}

export function parseOrderGiftMetadataFromComments(comments: string[]): OrderGiftMetadata {
  const giftedProductNames = new Set<string>();
  const giftedProductSkus = new Set<string>();
  const giftNotes = new Map<string, string>();

  for (const comment of comments) {
    for (const line of comment.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("- ")) {
        continue;
      }

      const match = trimmed.match(LINE_METADATA_LINE_PATTERN);
      if (!match) {
        continue;
      }

      const productName = match[1].trim();
      const productIdentifier = match[2].trim();
      const details = match[3];
      const keys = [productName, productIdentifier];

      if (isGiftDetails(details)) {
        giftedProductNames.add(normalizeKey(productName));
        giftedProductSkus.add(normalizeKey(productIdentifier));
      }

      const noteMatch = details.match(GIFT_NOTE_PATTERN);
      if (noteMatch?.[1]?.trim()) {
        storeGiftNote(giftNotes, keys, noteMatch[1].trim());
      }
    }
  }

  return { giftedProductNames, giftedProductSkus, giftNotes };
}

export function detectGiftFromOrderItemOptions(options: CustomerOrderItemOption[]): boolean {
  return options.some((option) => {
    const label = normalizeKey(option.label);
    const value = normalizeKey(option.value);

    if (isGiftOptionLabel(label) && (isTruthyGiftValue(value) || value === "")) {
      return true;
    }

    if (isTruthyGiftValue(value) && (label.includes("wrap") || label.includes("gift"))) {
      return true;
    }

    return false;
  });
}

export function parseGiftMarkedProductNamesFromComments(comments: string[]): Set<string> {
  return parseOrderGiftMetadataFromComments(comments).giftedProductNames;
}

export function parseGiftNotesFromComments(comments: string[]): Map<string, string> {
  return parseOrderGiftMetadataFromComments(comments).giftNotes;
}

export function getOrderItemGiftNote(
  metadata: OrderGiftMetadata | undefined,
  productName: string,
  productSku?: string | null,
): string | undefined {
  if (!metadata) {
    return undefined;
  }

  const sku = productSku?.trim();
  if (sku) {
    const noteBySku = metadata.giftNotes.get(normalizeKey(sku));
    if (noteBySku) {
      return noteBySku;
    }
  }

  return metadata.giftNotes.get(normalizeKey(productName));
}

export function isOrderItemGiftMarked(
  metadata: OrderGiftMetadata | undefined,
  productName: string,
  productSku?: string | null,
  options: CustomerOrderItemOption[] = [],
): boolean {
  if (detectGiftFromOrderItemOptions(options)) {
    return true;
  }

  if (!metadata) {
    return false;
  }

  if (metadata.giftedProductNames.has(normalizeKey(productName))) {
    return true;
  }

  const sku = productSku?.trim();
  if (sku && metadata.giftedProductSkus.has(normalizeKey(sku))) {
    return true;
  }

  return false;
}

export function isGiftMarkedOrderItem(
  productName: string,
  options: CustomerOrderItemOption[],
  giftedProductNames?: Set<string>,
  productSku?: string | null,
): boolean {
  const metadata =
    giftedProductNames
      ? {
          giftedProductNames,
          giftedProductSkus: new Set<string>(),
          giftNotes: new Map<string, string>(),
        }
      : EMPTY_GIFT_METADATA;

  return isOrderItemGiftMarked(metadata, productName, productSku, options);
}
