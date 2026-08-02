import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { MAGENTO_URL_KEY_TO_SLUG } from "@/features/jewellery-product/utils/jewelleryRoutes";
import type {
  NormalizedSizeGuide,
  NormalizedSizeGuideRow,
  StrapiSizeGuide,
  StrapiSizeGuideRow,
  StrapiSizeGuidesResponse,
} from "./size-guide.types";

function cleanText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** CMS uses singular `bracelet`; Magento/app slug is `bracelets`. */
const CATEGORY_KEY_ALIASES: Record<string, string> = {
  ring: "rings",
  rings: "rings",
  bracelet: "bracelets",
  bracelets: "bracelets",
  bangle: "bangles",
  bangles: "bangles",
  earring: "earrings",
  earrings: "earrings",
  pendant: "pendants",
  pendants: "pendants",
  necklace: "necklace",
  necklaces: "necklace",
  nosepin: "nosepins",
  "nose-pin": "nosepins",
  "nose-pins": "nosepins",
  nosepins: "nosepins",
};

export function canonicalizeSizeGuideCategoryKey(
  value: string | null | undefined,
): string | null {
  const normalized = cleanText(value)?.toLowerCase().replace(/_/g, "-") ?? null;
  if (!normalized) return null;
  return CATEGORY_KEY_ALIASES[normalized] ?? normalized;
}

export function resolveProductSizeGuideCategoryKey(product: {
  categoryUrlKey?: string | null;
  categorySlug?: string | null;
  category?: string | null;
}): string | null {
  // Prefer Magento url_key — most reliable bridge to CMS `name`.
  const urlKey = cleanText(product.categoryUrlKey)?.toLowerCase();
  if (urlKey && MAGENTO_URL_KEY_TO_SLUG[urlKey]) {
    return MAGENTO_URL_KEY_TO_SLUG[urlKey];
  }

  const fromSlug = canonicalizeSizeGuideCategoryKey(product.categorySlug);
  if (fromSlug) {
    return fromSlug;
  }

  // Display name fallback ("Bangles", "Rings", …).
  return canonicalizeSizeGuideCategoryKey(product.category);
}

export function findSizeGuideForCategory(
  guides: readonly NormalizedSizeGuide[],
  categoryKey: string | null | undefined,
): NormalizedSizeGuide | null {
  const target = canonicalizeSizeGuideCategoryKey(categoryKey);
  if (!target) {
    return null;
  }

  return (
    guides.find((guide) => guide.categoryKey === target) ??
    guides.find((guide) => canonicalizeSizeGuideCategoryKey(guide.name) === target) ??
    null
  );
}

/** Resolve the CMS size guide for a PDP product (url_key → slug → category name). */
export function resolveSizeGuideForProduct(
  guides: readonly NormalizedSizeGuide[],
  product: {
    categoryUrlKey?: string | null;
    categorySlug?: string | null;
    category?: string | null;
  },
): NormalizedSizeGuide | null {
  if (!guides.length) {
    return null;
  }

  const candidates = [
    product.categoryUrlKey && MAGENTO_URL_KEY_TO_SLUG[product.categoryUrlKey],
    product.categorySlug,
    product.categoryUrlKey,
    product.category,
  ];

  const seen = new Set<string>();
  for (const candidate of candidates) {
    const key = canonicalizeSizeGuideCategoryKey(candidate);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);

    const matched = findSizeGuideForCategory(guides, key);
    if (matched) {
      return matched;
    }
  }

  // Exact Magento url_key patterns only — never substring match
  // (`diamond-earrings` contains "rings" and must not resolve to the rings guide).
  const urlKey = cleanText(product.categoryUrlKey)?.toLowerCase();
  if (urlKey) {
    const fromMap = MAGENTO_URL_KEY_TO_SLUG[urlKey];
    if (fromMap) {
      const mapped = findSizeGuideForCategory(guides, fromMap);
      if (mapped) {
        return mapped;
      }
    }

    const exact = guides.find(
      (guide) =>
        urlKey === guide.categoryKey ||
        urlKey === guide.name.toLowerCase() ||
        urlKey === `diamond-${guide.categoryKey}` ||
        urlKey === `diamond-${guide.name.toLowerCase()}`,
    );
    if (exact) {
      return exact;
    }
  }

  return null;
}

function mapRow(row: StrapiSizeGuideRow | null | undefined): NormalizedSizeGuideRow | null {
  if (!row) return null;

  const size = cleanText(row.sizeLabel);
  if (!size) return null;

  return {
    circumference: cleanText(row.circumference) ?? "",
    diameter: cleanText(row.diameter) ?? "",
    size,
  };
}

function sizeFieldLabelFromGuide(drawerTitle: string | null, name: string): string {
  const fromTitle = drawerTitle?.replace(/\s*guide\s*$/i, "").trim();
  if (fromTitle) return fromTitle;

  const key = canonicalizeSizeGuideCategoryKey(name) ?? name;
  const singular = key.endsWith("s") ? key.slice(0, -1) : key;
  return `${singular.charAt(0).toUpperCase()}${singular.slice(1)} Size`;
}

export function mapSizeGuide(raw?: StrapiSizeGuide | null): NormalizedSizeGuide | null {
  if (!raw) return null;

  const name = cleanText(raw.name);
  if (!name) return null;

  const categoryKey = canonicalizeSizeGuideCategoryKey(name);
  if (!categoryKey) return null;

  const rows = (raw.chartRows ?? [])
    .map(mapRow)
    .filter((row): row is NormalizedSizeGuideRow => row != null);

  const sizeLabels = Array.from(new Set(rows.map((row) => row.size)));
  const drawerTitle = cleanText(raw.drawerTitle) ?? `${name} Size Guide`;
  const drawerSubtitle = cleanText(raw.drawerSubtitle) ?? "Measure Dimensions in millimeters";

  return {
    name,
    categoryKey,
    drawerTitle,
    drawerSubtitle,
    sizeFieldLabel: sizeFieldLabelFromGuide(drawerTitle, name),
    sizeLabels,
    rows,
    tutorialVideoUrl: resolveCmsMediaUrl(raw.tutorialVideo),
    circumferenceHeaderImageUrl: resolveCmsMediaUrl(raw.circumferenceHeaderImage),
    diameterHeaderImageUrl: resolveCmsMediaUrl(raw.diameterHeaderImage),
  };
}

export function mapSizeGuides(
  raw?: StrapiSizeGuide[] | StrapiSizeGuidesResponse | null,
): NormalizedSizeGuide[] {
  const items = Array.isArray(raw) ? raw : raw?.data;
  if (!Array.isArray(items)) return [];

  return items
    .map(mapSizeGuide)
    .filter((guide): guide is NormalizedSizeGuide => guide != null);
}
