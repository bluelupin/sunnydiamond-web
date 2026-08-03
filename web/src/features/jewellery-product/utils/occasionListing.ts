import { JEWELLERY_PATH } from "./jewelleryRoutes";
import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";

export function slugifyOccasionTitle(title: string | null | undefined): string {
  return (title ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolve a CMS/URL occasion slug (or Magento option id) against live Magento options.
 * Accepts raw labels ("evening & parties"), spaced forms ("evening and parties"),
 * and hyphen slugs ("evening-and-parties").
 */
export function resolveOccasionFacetOption(
  occasionSlug: string | null | undefined,
  occasions: readonly JewelleryFilterFacetOption[] = [],
): JewelleryFilterFacetOption | null {
  const raw = occasionSlug?.trim();
  if (!raw) {
    return null;
  }

  const normalized = raw.toLowerCase();
  const normalizedSlug = slugifyOccasionTitle(raw);

  return (
    occasions.find((option) => {
      const label = option.label.trim().toLowerCase();
      const labelSlug = slugifyOccasionTitle(option.label);
      const value = option.value.trim().toLowerCase();

      return (
        value === normalized ||
        value === normalizedSlug ||
        label === normalized ||
        labelSlug === normalized ||
        labelSlug === normalizedSlug
      );
    }) ?? null
  );
}

/** Always emit a hyphenated occasion slug in PLP URLs. */
export function buildJewelleryOccasionHref(
  occasionSlug: string | null | undefined,
): string {
  const slug = slugifyOccasionTitle(occasionSlug);
  if (!slug) {
    return JEWELLERY_PATH;
  }

  return `${JEWELLERY_PATH}?occasion=${encodeURIComponent(slug)}`;
}

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

/** If a CMS CTA already has `?occasion=…`, rewrite it to a clean hyphen slug. */
export function normalizeJewelleryOccasionCtaUrl(ctaUrl: string): string {
  const trimmed = ctaUrl.trim();
  if (!trimmed) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed, "http://occasion.local");
    const occasion = url.searchParams.get("occasion");
    if (!occasion) {
      return trimmed;
    }

    const slug = slugifyOccasionTitle(occasion);
    if (!slug) {
      return trimmed;
    }

    url.searchParams.set("occasion", slug);

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return url.toString();
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return trimmed;
  }
}

export function buildOccasionCardHref({
  title,
  slug,
  filterSlug,
  ctaUrl,
}: {
  title?: string | null;
  slug?: string | null;
  filterSlug?: string | null;
  ctaUrl?: string | null;
}): string {
  const normalizedCtaUrl = ctaUrl?.trim();
  if (normalizedCtaUrl && !GENERIC_PRODUCT_LISTING_PATHS.has(normalizedCtaUrl.toLowerCase())) {
    // Prefer CMS deep links, but always clean `?occasion=` when present.
    if (normalizedCtaUrl.includes("occasion=")) {
      return normalizeJewelleryOccasionCtaUrl(normalizedCtaUrl);
    }
    return normalizedCtaUrl;
  }

  const occasionSlug =
    filterSlug?.trim() || slug?.trim() || slugifyOccasionTitle(title);
  return buildJewelleryOccasionHref(occasionSlug);
}
