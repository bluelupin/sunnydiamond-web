/**
 * Diamonds for Everyone simulator numbers. Editors set them in Strapi
 * (`investmentPlannerSection`); anything missing or inconsistent falls back to the
 * built-in defaults, so the page never renders an impossible range.
 *
 * No imports on purpose: `scripts/check-dfe-investment-config.mjs` runs this file
 * directly under Node's type stripping.
 */
export type DfeInvestmentConfig = {
  minMonthly: number;
  maxMonthly: number;
  step: number;
  defaultMonthly: number;
  monthsPaid: number;
  totalMonths: number;
};

export type DfeInvestmentConfigInput = {
  [Key in keyof DfeInvestmentConfig]?: number | null;
};

export type DfeInvestmentSummary = {
  contribution: number;
  bonus: number;
  totalValue: number;
};

/** CMS slider/config ceilings. Manual entry may exceed the slider maximum. */
export const DFE_MAX_MONTHLY_AMOUNT = 1_000_000;
export const DFE_MAX_PLAN_MONTHS = 36;
export const DFE_MIN_MONTHLY_AMOUNT = 1_000;

const positiveInteger = (
  value: number | null | undefined,
  fallback: number,
  ceiling: number,
): number =>
  typeof value === "number" && Number.isInteger(value) && value > 0 && value <= ceiling
    ? value
    : fallback;

/** Whole rupees from the business minimum; maxMonthly only bounds the slider. */
export function clampDfeMonthlyAmount(
  value: number,
  config: Pick<DfeInvestmentConfig, "minMonthly">,
): number {
  return Number.isFinite(value)
    ? Math.max(config.minMonthly, Math.round(value))
    : config.minMonthly;
}

/** A step must land exactly on the maximum, or the slider can't reach it. */
const fitsRange = (step: number, range: number) => step <= range && range % step === 0;

/**
 * Each field falls back on its own; a pair that contradicts itself falls back as a pair.
 * Bonus months may not exceed paid months, so "1 of 12" (a typo for 11) can't advertise
 * eleven free months.
 */
export function resolveDfeInvestmentConfig(
  input: DfeInvestmentConfigInput | null | undefined,
  defaults: DfeInvestmentConfig,
): DfeInvestmentConfig {
  // The approved contribution floor is fixed even if an older CMS value differs.
  const minMonthly = DFE_MIN_MONTHLY_AMOUNT;
  let maxMonthly = positiveInteger(input?.maxMonthly, defaults.maxMonthly, DFE_MAX_MONTHLY_AMOUNT);
  if (minMonthly >= maxMonthly) {
    maxMonthly = defaults.maxMonthly;
  }

  let monthsPaid = positiveInteger(input?.monthsPaid, defaults.monthsPaid, DFE_MAX_PLAN_MONTHS);
  let totalMonths = positiveInteger(input?.totalMonths, defaults.totalMonths, DFE_MAX_PLAN_MONTHS);
  if (monthsPaid >= totalMonths || totalMonths - monthsPaid > monthsPaid) {
    monthsPaid = defaults.monthsPaid;
    totalMonths = defaults.totalMonths;
  }

  const span = maxMonthly - minMonthly;
  const requestedStep = positiveInteger(input?.step, defaults.step, DFE_MAX_MONTHLY_AMOUNT);
  const step = fitsRange(requestedStep, span)
    ? requestedStep
    : fitsRange(defaults.step, span)
      ? defaults.step
      : 1;

  // Snap the starting amount onto the slider's grid so thumb and figures agree.
  const requestedDefault = positiveInteger(
    input?.defaultMonthly,
    defaults.defaultMonthly,
    DFE_MAX_MONTHLY_AMOUNT,
  );
  const snappedDefault =
    minMonthly + Math.round((requestedDefault - minMonthly) / step) * step;

  return {
    minMonthly,
    maxMonthly,
    step,
    defaultMonthly: Math.min(maxMonthly, clampDfeMonthlyAmount(snappedDefault, { minMonthly })),
    monthsPaid,
    totalMonths,
  };
}

/** Bonus = the unpaid months, so "one month free" follows the configured months. */
export function computeDfeInvestmentSummary(
  monthlyAmount: number,
  config: Pick<DfeInvestmentConfig, "monthsPaid" | "totalMonths">,
): DfeInvestmentSummary {
  return {
    contribution: monthlyAmount * config.monthsPaid,
    bonus: monthlyAmount * (config.totalMonths - config.monthsPaid),
    totalValue: monthlyAmount * config.totalMonths,
  };
}
