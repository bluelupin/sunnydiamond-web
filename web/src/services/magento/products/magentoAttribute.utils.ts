import type {
  MagentoCustomAttributeItem,
  MagentoMediaGalleryItem,
} from "./magentoProduct.types";

export function getMagentoCustomAttributeValue(
  items: MagentoCustomAttributeItem[] | null | undefined,
  code: string,
): string | null {
  const item = (items ?? []).find((attribute) => attribute.code?.trim() === code);
  if (!item) {
    return null;
  }

  const selected = item.selected_options?.[0]?.label?.trim() || item.selected_options?.[0]?.value?.trim();
  if (selected) {
    return selected;
  }

  const value = item.value?.trim();
  return value || null;
}

function parseMagentoAttributeListValue(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((entry) => String(entry).trim()).filter(Boolean);
      }
    } catch {
      // Fall through to delimiter parsing.
    }
  }

  return trimmed
    .split(/[,;|]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function getMagentoCustomAttributeSelectedValues(
  items: MagentoCustomAttributeItem[] | null | undefined,
  code: string,
): string[] {
  const item = (items ?? []).find((attribute) => attribute.code?.trim() === code);
  if (!item) {
    return [];
  }

  const fromSelected = (item.selected_options ?? [])
    .map((option) => option.value?.trim() || "")
    .filter((value) => value.length > 0);

  if (fromSelected.length > 0) {
    return fromSelected;
  }

  const value = item.value?.trim();
  return value ? parseMagentoAttributeListValue(value) : [];
}

export function getMagentoCustomAttributeOptionLabels(
  items: MagentoCustomAttributeItem[] | null | undefined,
  code: string,
): string[] {
  const item = (items ?? []).find((attribute) => attribute.code?.trim() === code);
  if (!item) {
    return [];
  }

  const fromSelected = (item.selected_options ?? [])
    .map((option) => option.label?.trim() || option.value?.trim() || "")
    .filter((label) => label.length > 0 && label !== " ");

  if (fromSelected.length > 0) {
    return fromSelected;
  }

  const value = item.value?.trim();
  return value ? parseMagentoAttributeListValue(value) : [];
}

export function isMagentoBooleanTruthy(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "yes" || normalized === "true";
}

export function isMagentoBestSeller(
  items: MagentoCustomAttributeItem[] | null | undefined,
): boolean {
  return isMagentoBooleanTruthy(getMagentoCustomAttributeValue(items, "is_best_seller"));
}

export function isMagentoTrending(
  items: MagentoCustomAttributeItem[] | null | undefined,
): boolean {
  return isMagentoBooleanTruthy(getMagentoCustomAttributeValue(items, "sd_trending"));
}

function getActiveGalleryUrls(
  mediaGallery: MagentoMediaGalleryItem[] | null | undefined,
): string[] {
  return (mediaGallery ?? [])
    .filter((item) => item?.url && !item.disabled)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((item) => item.url!.trim());
}

function buildMagentoDirectCatalogUrl(
  relativePath: string,
  referenceImageUrl?: string | null,
): string {
  const reference = referenceImageUrl?.trim();
  if (!reference) {
    return "";
  }

  const marker = "/media/catalog/product/";
  const markerIndex = reference.indexOf(marker);
  if (markerIndex === -1) {
    return "";
  }

  const prefix = reference.slice(0, markerIndex + marker.length);
  const path = relativePath.replace(/^\/+/, "");
  return path ? `${prefix}${path}` : "";
}

/** Magento cache URLs for shared model-wear assets can 403 — use the direct catalog path. */
function stripMagentoImageCacheSegment(url: string): string {
  const marker = "/media/catalog/product/cache/";
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) {
    return url;
  }

  const afterCache = url.slice(markerIndex + marker.length);
  const pathStart = afterCache.indexOf("/");
  if (pathStart === -1) {
    return url;
  }

  const catalogPath = afterCache.slice(pathStart + 1);
  return `${url.slice(0, markerIndex)}/media/catalog/product/${catalogPath}`;
}

/** Resolves Magento `model_wear_image` (absolute URL or catalog-relative path) to a CDN URL. */
export function resolveMagentoModelWearImageUrl(
  modelWearImage: string | null | undefined,
  mediaGallery: MagentoMediaGalleryItem[] | null | undefined,
  referenceImageUrl?: string | null,
): string {
  const raw = modelWearImage?.trim();
  if (!raw || isMagentoPlaceholderImage(raw)) {
    return "";
  }

  if (/^https?:\/\//i.test(raw)) {
    return stripMagentoImageCacheSegment(raw);
  }

  const directUrl = buildMagentoDirectCatalogUrl(raw, referenceImageUrl);
  if (directUrl) {
    return directUrl;
  }

  const galleryUrls = getActiveGalleryUrls(mediaGallery);
  const filename = raw.split("/").pop() ?? raw;
  const galleryMatch = galleryUrls.find(
    (url) => url.includes(raw) || url.endsWith(raw) || url.split("/").pop() === filename,
  );

  return galleryMatch ? stripMagentoImageCacheSegment(galleryMatch) : "";
}

export function isMagentoPlaceholderImage(url: string | null | undefined): boolean {
  if (!url?.trim()) {
    return true;
  }

  const lower = url.trim().toLowerCase();
  return (
    lower.includes("/static/version") ||
    lower.includes("/placeholder/") ||
    (lower.endsWith("/image.jpg") && lower.includes("placeholder"))
  );
}

export function formatMagentoFacetLabel(value: string | null | undefined): string | null {
  if (!value?.trim()) {
    return null;
  }

  return value
    .trim()
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeGemstoneToken(token: string): string {
  return token
    .replace(/_+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function normalizeGemstoneTypeLabel(raw: string | null | undefined): string | null {
  if (!raw?.trim()) {
    return null;
  }

  const parts = raw
    .split(/[,;]/)
    .map((part) => normalizeGemstoneToken(part))
    .filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  return Array.from(new Set(parts)).join(", ");
}
