/** GA4 measurement ID — set NEXT_PUBLIC_GA_MEASUREMENT_ID in env for each environment. */
export function getGaMeasurementId(): string {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
}

/** Google Search Console HTML tag verification token. */
export function getGoogleSiteVerification(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ?? "";
}
