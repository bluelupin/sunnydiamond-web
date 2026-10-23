import type { NormalizedEducationDiscoverStep } from "@/services/education/learn-about-diamonds-page.types";
import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";

export const DEFAULT_DISCOVER_JOURNEY_STEPS: readonly NormalizedEducationDiscoverStep[] = [
  {
    title: "Define your price range",
    description: "",
  },
  {
    title: "Choose your jewellery type",
    description: "",
  },
  {
    title: "Pick your preferred diamond shape",
    description: "",
  },
] as const;

export const DISCOVER_JOURNEY_PANEL_CONTENT_MAX_CLASS = "max-w-[424px]";

/** Figma — Discover journey step 1 price range validation (node 4903:61793). */
export const DISCOVER_JOURNEY_NO_PRODUCTS_IN_RANGE_MESSAGE =
  "No products found for this price range.";

/** Discover journey step 2 — category + step 1 price range. */
export const DISCOVER_JOURNEY_NO_PRODUCTS_IN_CATEGORY_AND_RANGE_MESSAGE =
  "No products found for this jewellery type";

/** Discover journey step 3 — diamond shape + category + price range. */
export const DISCOVER_JOURNEY_NO_PRODUCTS_IN_SHAPE_CATEGORY_AND_RANGE_MESSAGE =
  "No products found for this diamond shape";

export const MAGENTO_DIAMOND_SHAPE_ATTRIBUTE_CODE = "sd_diamond_shape";

function isMagentoDiamondShapeAdminPlaceholder(label: string): boolean {
  const normalized = label.trim().toLowerCase();
  return (
    normalized.length === 0 ||
    normalized === "--" ||
    normalized.startsWith("-- ") ||
    normalized.includes("please select")
  );
}

/** Discover journey step 3 — Magento attribute metadata only (admin order preserved). */
export function normalizeDiscoverJourneyDiamondShapeOptions(
  shapes: readonly JewelleryFilterFacetOption[],
): JewelleryFilterFacetOption[] {
  const normalized: JewelleryFilterFacetOption[] = [];
  const seenValues = new Set<string>();

  for (const option of shapes) {
    const value = option.value.trim();
    const label = option.label.trim();
    if (
      !value ||
      !label ||
      seenValues.has(value) ||
      isMagentoDiamondShapeAdminPlaceholder(label)
    ) {
      continue;
    }

    seenValues.add(value);
    normalized.push({ value, label });
  }

  return normalized;
}

export function resolveDiscoverJourneySteps(
  steps?: readonly NormalizedEducationDiscoverStep[],
): NormalizedEducationDiscoverStep[] {
  const cmsSteps = (steps ?? [])
    .map((step) => ({
      title: step.title.trim(),
      description: step.description.trim(),
    }))
    .filter((step) => step.title)
    .slice(0, 3);

  if (cmsSteps.length >= 3) {
    return cmsSteps;
  }

  return DEFAULT_DISCOVER_JOURNEY_STEPS.map((step) => ({ ...step }));
}

export function resolveDiscoverJourneyStepLabels(
  steps?: readonly NormalizedEducationDiscoverStep[],
): string[] {
  return resolveDiscoverJourneySteps(steps).map((step) => step.title);
}
