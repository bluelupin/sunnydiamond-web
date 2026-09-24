export const DEFAULT_DISCOVER_JOURNEY_STEPS = [
  "Define your price range",
  "Choose your jewellery type",
  "Pick your preferred diamond shape",
] as const;

export const DISCOVER_JOURNEY_PANEL_CONTENT_MAX_CLASS = "max-w-[424px]";

export function resolveDiscoverJourneyStepLabels(steps?: readonly string[]): string[] {
  const cmsSteps = (steps ?? []).map((step) => step.trim()).filter(Boolean).slice(0, 3);

  if (cmsSteps.length >= 3) {
    return cmsSteps;
  }

  return [...DEFAULT_DISCOVER_JOURNEY_STEPS];
}
