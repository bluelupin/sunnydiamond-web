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

const LINE_METADATA_LINE_PATTERN = /^-\s+(.+?)\s+\([^)]+\):\s*(.+)$/;

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
  const giftedNames = new Set<string>();

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
      const details = match[2];

      if (
        details.includes("Gift wrap: Yes") ||
        normalizeKey(details).includes("gift wrap")
      ) {
        giftedNames.add(normalizeKey(productName));
      }
    }
  }

  return giftedNames;
}

const GIFT_NOTE_PATTERN = /Gift note:\s*"([^"]+)"/i;

export function parseGiftNotesFromComments(comments: string[]): Map<string, string> {
  const notes = new Map<string, string>();

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
      const details = match[2];
      const noteMatch = details.match(GIFT_NOTE_PATTERN);

      if (noteMatch?.[1]?.trim()) {
        notes.set(normalizeKey(productName), noteMatch[1].trim());
      }
    }
  }

  return notes;
}

export function isGiftMarkedOrderItem(
  productName: string,
  options: CustomerOrderItemOption[],
  giftedProductNames?: Set<string>,
): boolean {
  if (detectGiftFromOrderItemOptions(options)) {
    return true;
  }

  return giftedProductNames?.has(normalizeKey(productName)) ?? false;
}
