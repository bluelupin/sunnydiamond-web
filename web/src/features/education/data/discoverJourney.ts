export const DEFAULT_DISCOVER_JOURNEY_STEPS = [
  "Define your price range",
  "Choose your jewellery type",
  "Pick your preferred diamond shape",
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

export function resolveDiscoverJourneyStepLabels(steps?: readonly string[]): string[] {
  const cmsSteps = (steps ?? []).map((step) => step.trim()).filter(Boolean).slice(0, 3);

  if (cmsSteps.length >= 3) {
    return cmsSteps;
  }

  return [...DEFAULT_DISCOVER_JOURNEY_STEPS];
}
