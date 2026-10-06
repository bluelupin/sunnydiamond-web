import { DIAMOND_SHAPE_OPTIONS } from "@/features/jewellery-product/utils/diamondShapeListing";
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

/** Full step-3 shape list (catalog facets, not narrowed by category/price). */
export function resolveDiscoverJourneyDiamondShapeOptions(
  shapes: readonly JewelleryFilterFacetOption[],
): JewelleryFilterFacetOption[] {
  const mergedByValue = new Map<string, JewelleryFilterFacetOption>();

  for (const option of DIAMOND_SHAPE_OPTIONS) {
    mergedByValue.set(option.value, option);
  }

  for (const option of shapes) {
    const value = option.value.trim();
    const label = option.label.trim();
    if (!value || !label) {
      continue;
    }

    mergedByValue.set(value, { value, label });
  }

  return orderDiscoverJourneyDiamondShapes([...mergedByValue.values()]);
}

/** Stable discover-journey shape order (known Magento ids first, then A–Z). */
export function orderDiscoverJourneyDiamondShapes(
  shapes: readonly JewelleryFilterFacetOption[],
): JewelleryFilterFacetOption[] {
  const knownOrder = new Map(DIAMOND_SHAPE_OPTIONS.map((option, index) => [option.value, index]));

  return shapes
    .filter((option) => option.label.trim() && option.value.trim())
    .sort((left, right) => {
      const leftOrder = knownOrder.get(left.value) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = knownOrder.get(right.value) ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.label.localeCompare(right.label);
    });
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
