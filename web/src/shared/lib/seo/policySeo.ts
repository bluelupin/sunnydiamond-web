import type { NormalizedPolicyCertificationsPage } from "@/services/policy/policy-certifications-page.types";
import { POLICY_AND_CERTIFICATIONS_PATH } from "@/shared/utils/navigation";

/** CMS SEO only — no invented copy when fields are empty. */
export function resolvePolicySeoMetadata(page: NormalizedPolicyCertificationsPage) {
  const cmsSeo = page.seo;

  return {
    title: cmsSeo?.metaTitle?.trim() || page.pageTitle.trim(),
    description: cmsSeo?.metaDescription?.trim() || undefined,
    canonicalPath: cmsSeo?.canonicalPath ?? POLICY_AND_CERTIFICATIONS_PATH,
    keywords: cmsSeo?.keywords?.trim() || undefined,
    image: cmsSeo?.ogImageUrl,
  };
}
