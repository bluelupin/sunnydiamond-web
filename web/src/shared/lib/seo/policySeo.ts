import type { NormalizedPolicyCertificationsPage } from "@/services/policy/policy-certifications-page.types";
import { POLICY_AND_CERTIFICATIONS_PATH } from "@/shared/utils/navigation";

export function resolvePolicySeoMetadata(page: NormalizedPolicyCertificationsPage) {
  const cmsSeo = page.seo;

  return {
    title: cmsSeo?.metaTitle?.trim() || page.pageTitle,
    description: cmsSeo?.metaDescription?.trim(),
    canonicalPath: cmsSeo?.canonicalPath ?? POLICY_AND_CERTIFICATIONS_PATH,
    keywords: cmsSeo?.keywords?.trim(),
    image: cmsSeo?.ogImageUrl,
  };
}
