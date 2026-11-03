/** Google Search Console HTML tag verification token. */
export function getGoogleSiteVerification(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ?? "";
}
