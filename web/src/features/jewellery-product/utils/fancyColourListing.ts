import { JEWELLERY_PATH } from "./jewelleryRoutes";
import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";

/** Magento `sd_fancy_colour` options (option id → label). */
export const FANCY_COLOUR_OPTIONS: readonly JewelleryFilterFacetOption[] = [
  { value: "70", label: "Orange" },
  { value: "71", label: "Yellow" },
  { value: "72", label: "Pink" },
  { value: "73", label: "Purple" },
  { value: "74", label: "Red" },
  { value: "75", label: "Black" },
  { value: "76", label: "Brown" },
  { value: "77", label: "Champagne" },
] as const;

const GENERIC_PRODUCT_LISTING_PATHS = new Set([
  "/products",
  "/products/",
  "/jewellery",
  "/jewellery/",
  "/diamond-bangles",
  "/diamond-necklaces",
  "/diamond-rings",
  "/diamond-pendants",
  "/diamond-nose-pins",
  "/diamond-earrings",
  "/diamond-bracelets",
]);

export function slugifyFancyColourLabel(label: string | null | undefined): string {
  return (label ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveFancyColourFacetOption(
  colourSlug: string | null | undefined,
  fancyColours: readonly JewelleryFilterFacetOption[] = [],
): JewelleryFilterFacetOption | null {
  const normalized = colourSlug?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const matchIn = (options: readonly JewelleryFilterFacetOption[]) =>
    options.find((option) => {
      const labelSlug = slugifyFancyColourLabel(option.label);
      return (
        option.label.trim().toLowerCase() === normalized ||
        labelSlug === normalized ||
        option.value.trim().toLowerCase() === normalized
      );
    }) ?? null;

  return matchIn(fancyColours) ?? matchIn(FANCY_COLOUR_OPTIONS);
}

export function buildJewelleryFancyColourHref(
  colourSlug: string | null | undefined,
): string {
  const slug = colourSlug?.trim();
  if (!slug) {
    return JEWELLERY_PATH;
  }

  return `${JEWELLERY_PATH}?fancyColour=${encodeURIComponent(slug)}`;
}

/** Pull a known colour slug from CTA copy like "SHOP YELLOW FANCY COLOUR DIAMONDS". */
export function extractFancyColourSlugFromLabel(
  label: string | null | undefined,
): string | null {
  const slug = slugifyFancyColourLabel(label);
  if (!slug) {
    return null;
  }

  // Prefer longer labels first (e.g. champagne before... none shorter conflict).
  const optionsByLabelLength = [...FANCY_COLOUR_OPTIONS].sort(
    (left, right) => right.label.length - left.label.length,
  );

  for (const option of optionsByLabelLength) {
    const colourSlug = slugifyFancyColourLabel(option.label);
    if (
      slug === colourSlug ||
      slug.startsWith(`${colourSlug}-`) ||
      slug.includes(`-${colourSlug}-`) ||
      slug.endsWith(`-${colourSlug}`)
    ) {
      return colourSlug;
    }
  }

  return null;
}

function readFancyColourParamFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url, "https://sunnydiamonds.local");
    return parsed.searchParams.get("fancyColour")?.trim() || null;
  } catch {
    return null;
  }
}

function hasFancyColourParamInUrl(url: string): boolean {
  try {
    return new URL(url, "https://sunnydiamonds.local").searchParams.has("fancyColour");
  } catch {
    return false;
  }
}

/**
 * CMS URL first when `fancyColour` is present and valid.
 * Dynamic fallback to CTA label when the URL is missing, generic, or invalid.
 */
export function resolveEducationFancyColourHref({
  ctaLabel,
  ctaUrl,
}: {
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}): string | undefined {
  const normalizedCtaUrl = ctaUrl?.trim();
  const labelColourSlug = extractFancyColourSlugFromLabel(ctaLabel);

  if (normalizedCtaUrl) {
    const fromUrl = readFancyColourParamFromUrl(normalizedCtaUrl);
    const hasColourParam = hasFancyColourParamInUrl(normalizedCtaUrl);

    if (hasColourParam) {
      // Valid CMS deep-link → keep as-is (CMS priority).
      if (fromUrl && resolveFancyColourFacetOption(fromUrl)) {
        return buildJewelleryFancyColourHref(fromUrl);
      }

      // Incorrect/empty fancyColour → dynamic fallback from CTA label.
      if (labelColourSlug) {
        return buildJewelleryFancyColourHref(labelColourSlug);
      }

      return normalizedCtaUrl;
    }

    const pathOnly = normalizedCtaUrl.split("?")[0]?.toLowerCase() ?? "";
    if (!GENERIC_PRODUCT_LISTING_PATHS.has(pathOnly)) {
      return normalizedCtaUrl;
    }
  }

  // Missing / generic listing URL → dynamic fallback from CTA label.
  if (!labelColourSlug) {
    return normalizedCtaUrl || undefined;
  }

  return buildJewelleryFancyColourHref(labelColourSlug);
}
