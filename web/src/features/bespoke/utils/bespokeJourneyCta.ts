import type { NormalizedBespokeCustomDesignForm } from "@/services/bespoke/contact-bespoke-page.types";

/** Same gate as the story section “Begin your journey” CTA — opens Share Vision when true. */
export function isBespokeJourneyCtaEnabled(
  ctaLabel: string | undefined | null,
  customDesignForm: NormalizedBespokeCustomDesignForm | null | undefined,
): boolean {
  return Boolean(ctaLabel?.trim() && customDesignForm);
}
