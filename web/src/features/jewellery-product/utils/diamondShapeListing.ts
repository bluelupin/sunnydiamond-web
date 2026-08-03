import { JEWELLERY_PATH } from "./jewelleryRoutes";
import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";

/** Magento `sd_diamond_shape` options (option id → label). */
export const DIAMOND_SHAPE_OPTIONS: readonly JewelleryFilterFacetOption[] = [
  { value: "64", label: "Round" },
  { value: "65", label: "Oval" },
  { value: "66", label: "Cushion" },
  { value: "67", label: "Pear" },
  { value: "68", label: "Emerald" },
  { value: "69", label: "Heart" },
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

export function slugifyDiamondShapeLabel(label: string | null | undefined): string {
  return (label ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveDiamondShapeFacetOption(
  shapeSlug: string | null | undefined,
  diamondShapes: readonly JewelleryFilterFacetOption[] = [],
): JewelleryFilterFacetOption | null {
  const normalized = shapeSlug?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const matchIn = (options: readonly JewelleryFilterFacetOption[]) =>
    options.find((option) => {
      const labelSlug = slugifyDiamondShapeLabel(option.label);
      return (
        option.label.trim().toLowerCase() === normalized ||
        labelSlug === normalized ||
        option.value.trim().toLowerCase() === normalized
      );
    }) ?? null;

  return matchIn(diamondShapes) ?? matchIn(DIAMOND_SHAPE_OPTIONS);
}

export function buildJewelleryDiamondShapeHref(
  shapeSlug: string | null | undefined,
): string {
  const slug = shapeSlug?.trim();
  if (!slug) {
    return JEWELLERY_PATH;
  }

  return `${JEWELLERY_PATH}?diamondShape=${encodeURIComponent(slug)}`;
}

/** Pull a known shape slug from CTA copy like "SHOP CUSHION SHAPED DIAMONDS". */
export function extractDiamondShapeSlugFromLabel(
  label: string | null | undefined,
): string | null {
  const slug = slugifyDiamondShapeLabel(label);
  if (!slug) {
    return null;
  }

  for (const option of DIAMOND_SHAPE_OPTIONS) {
    const shapeSlug = slugifyDiamondShapeLabel(option.label);
    if (
      slug === shapeSlug ||
      slug.startsWith(`${shapeSlug}-`) ||
      slug.includes(`-${shapeSlug}-`) ||
      slug.endsWith(`-${shapeSlug}`)
    ) {
      return shapeSlug;
    }
  }

  return null;
}

function readDiamondShapeParamFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url, "https://sunnydiamonds.local");
    return parsed.searchParams.get("diamondShape")?.trim() || null;
  } catch {
    return null;
  }
}

function hasDiamondShapeParamInUrl(url: string): boolean {
  try {
    return new URL(url, "https://sunnydiamonds.local").searchParams.has("diamondShape");
  } catch {
    return false;
  }
}

/**
 * CMS URL first when `diamondShape` is present and valid.
 * Dynamic fallback to CTA label when the URL is missing, generic, or invalid.
 */
export function resolveEducationDiamondShapeHref({
  ctaLabel,
  ctaUrl,
}: {
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}): string | undefined {
  const normalizedCtaUrl = ctaUrl?.trim();
  const labelShapeSlug = extractDiamondShapeSlugFromLabel(ctaLabel);

  if (normalizedCtaUrl) {
    const fromUrl = readDiamondShapeParamFromUrl(normalizedCtaUrl);
    const hasShapeParam = hasDiamondShapeParamInUrl(normalizedCtaUrl);

    if (hasShapeParam) {
      // Valid CMS deep-link → keep as-is (CMS priority).
      if (fromUrl && resolveDiamondShapeFacetOption(fromUrl)) {
        return buildJewelleryDiamondShapeHref(fromUrl);
      }

      // Incorrect/empty diamondShape → dynamic fallback from CTA label.
      if (labelShapeSlug) {
        return buildJewelleryDiamondShapeHref(labelShapeSlug);
      }

      return normalizedCtaUrl;
    }

    const pathOnly = normalizedCtaUrl.split("?")[0]?.toLowerCase() ?? "";
    if (!GENERIC_PRODUCT_LISTING_PATHS.has(pathOnly)) {
      return normalizedCtaUrl;
    }
  }

  // Missing / generic listing URL → dynamic fallback from CTA label.
  if (!labelShapeSlug) {
    return normalizedCtaUrl || undefined;
  }

  return buildJewelleryDiamondShapeHref(labelShapeSlug);
}
