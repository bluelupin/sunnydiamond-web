import type { CartLineOptions } from "@/features/cart/types/cart.types";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";

/**
 * Magento engraving allows English letters, numbers, spaces, and . / -
 * — embedded line keys must use only those characters (no zero-width chars).
 */
const LINE_INSTANCE_EMBED_MARKER = "/.";
const LINE_INSTANCE_KEY_ONLY_PREFIX = ".";
const LINE_INSTANCE_KEY_SUFFIX_PATTERN = /\/\.[A-Za-z0-9]+$/;
const LINE_INSTANCE_KEY_ONLY_PATTERN = /^\.[A-Za-z0-9]+$/;

/** Matches DEFAULT_ENGRAVING_MAX_CHARACTERS — kept local to avoid circular imports. */
const DEFAULT_ENGRAVING_FIELD_MAX = 10;

const MIN_LINE_INSTANCE_KEY_LENGTH = 4;

export function createCartLineInstanceId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createShortCartLineInstanceId(length: number): string {
  const normalizedLength = Math.max(MIN_LINE_INSTANCE_KEY_LENGTH, Math.floor(length));
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const bytes =
    typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function"
      ? crypto.getRandomValues(new Uint8Array(normalizedLength))
      : Uint8Array.from({ length: normalizedLength }, () => Math.floor(Math.random() * 256));

  let result = "";
  for (let index = 0; index < normalizedLength; index += 1) {
    result += alphabet[bytes[index]! % alphabet.length];
  }

  return result;
}

function resolveDedicatedLineInstanceMaxLength(
  productCustomOptions?: ProductCustomOptions,
): number | null {
  if (!productCustomOptions?.lineInstance) {
    return null;
  }

  const max = productCustomOptions.lineInstance.maxCharacters;
  if (typeof max === "number" && Number.isFinite(max) && max > 0) {
    return Math.floor(max);
  }

  return 36;
}

function resolveEngravingCarrierKeyLength(
  productCustomOptions: ProductCustomOptions,
  displayEngraving: string,
): number {
  const maxCharacters =
    productCustomOptions.engravingText?.maxCharacters ?? DEFAULT_ENGRAVING_FIELD_MAX;
  const base = stripLineInstanceFromEngraving(displayEngraving).trim();

  if (!base) {
    return maxCharacters - LINE_INSTANCE_KEY_ONLY_PREFIX.length;
  }

  return maxCharacters - base.length - LINE_INSTANCE_EMBED_MARKER.length;
}

export function resolveLineInstanceKeyLength(
  productCustomOptions: ProductCustomOptions | undefined,
  displayEngraving = "",
): number | null {
  const normalizedEngraving = stripLineInstanceFromEngraving(displayEngraving).trim();
  const dedicatedMax = resolveDedicatedLineInstanceMaxLength(productCustomOptions);

  if (dedicatedMax != null) {
    return dedicatedMax;
  }

  if (!productCustomOptions?.engravingText) {
    return null;
  }

  return resolveEngravingCarrierKeyLength(productCustomOptions, normalizedEngraving);
}

export function createLineInstanceKeyForProduct(
  productCustomOptions?: ProductCustomOptions,
  displayEngraving = "",
): string | null {
  const keyLength = resolveLineInstanceKeyLength(productCustomOptions, displayEngraving);
  if (keyLength == null || keyLength < MIN_LINE_INSTANCE_KEY_LENGTH) {
    return null;
  }

  // A UUID is 36 characters — only use one when the field actually fits it.
  if (keyLength >= 36) {
    return createCartLineInstanceId();
  }

  return createShortCartLineInstanceId(keyLength);
}

function stripLegacyZeroWidthKey(value: string): string {
  const index = value.lastIndexOf("\u200B");
  if (index === -1) {
    return value;
  }

  return value.slice(0, index);
}

export function stripLineInstanceFromEngraving(value: string): string {
  const normalized = stripLegacyZeroWidthKey(value);

  if (LINE_INSTANCE_KEY_ONLY_PATTERN.test(normalized)) {
    return "";
  }

  const markerIndex = normalized.lastIndexOf(LINE_INSTANCE_EMBED_MARKER);
  if (markerIndex === -1) {
    return normalized;
  }

  return normalized.slice(0, markerIndex);
}

export function extractLineInstanceFromEngraving(value: string): string | null {
  const normalized = stripLegacyZeroWidthKey(value);

  const legacyIndex = normalized.lastIndexOf("\u200B");
  if (legacyIndex !== -1) {
    const key = normalized.slice(legacyIndex + 1).trim();
    return key || null;
  }

  const keyOnlyMatch = normalized.match(/^\.([A-Za-z0-9]+)$/);
  if (keyOnlyMatch?.[1]) {
    return keyOnlyMatch[1];
  }

  const suffixMatch = normalized.match(LINE_INSTANCE_KEY_SUFFIX_PATTERN);
  if (suffixMatch?.[0]) {
    return suffixMatch[0].slice(LINE_INSTANCE_EMBED_MARKER.length) || null;
  }

  return null;
}

export function embedLineInstanceInEngraving(
  displayEngraving: string,
  lineInstance: string,
  maxCharacters?: number | null,
): string {
  const base = stripLineInstanceFromEngraving(displayEngraving);
  const payload = base
    ? `${base}${LINE_INSTANCE_EMBED_MARKER}${lineInstance}`
    : `${LINE_INSTANCE_KEY_ONLY_PREFIX}${lineInstance}`;

  if (
    maxCharacters != null &&
    Number.isFinite(maxCharacters) &&
    payload.length > maxCharacters
  ) {
    throw new Error(
      "Could not add this item as a separate bag line because the engraving field is full.",
    );
  }

  return payload;
}

/** True when the product can carry a per-line instance key to Magento. */
export function supportsCartLineInstance(productCustomOptions?: ProductCustomOptions): boolean {
  if (productCustomOptions?.lineInstance) {
    return true;
  }

  if (!productCustomOptions?.engravingText) {
    return false;
  }

  return (
    resolveEngravingCarrierKeyLength(productCustomOptions, "") >= MIN_LINE_INSTANCE_KEY_LENGTH
  );
}

/** Assign a unique line instance before add — skipped when one is already set (edit/replace). */
export function assignCartLineInstance(
  options: CartLineOptions,
  productCustomOptions?: ProductCustomOptions,
): CartLineOptions {
  if (options.lineInstance?.trim()) {
    return options;
  }

  const displayEngraving = stripLineInstanceFromEngraving(options.engraving ?? "").trim();
  const lineInstance = createLineInstanceKeyForProduct(productCustomOptions, displayEngraving);
  if (!lineInstance) {
    return options;
  }

  return {
    ...options,
    lineInstance,
  };
}

export function resolveEngravingFieldMaxCharacters(
  productCustomOptions?: ProductCustomOptions,
): number | null {
  const max = productCustomOptions?.engravingText?.maxCharacters;
  if (typeof max === "number" && Number.isFinite(max) && max > 0) {
    return Math.floor(max);
  }

  return productCustomOptions?.engravingText ? DEFAULT_ENGRAVING_FIELD_MAX : null;
}
