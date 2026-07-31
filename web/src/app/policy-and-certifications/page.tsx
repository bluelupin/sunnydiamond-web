import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import PolicyCertificationsPage from "@/features/cms/components/policy/PolicyCertificationsPage";
import { POLICY_AND_CERTIFICATIONS_PATH } from "@/shared/utils/navigation";
import {
  EMPTY_POLICY_CERTIFICATIONS_PAGE,
  getPolicyCertificationsPage,
} from "@/services/policy/policy-certifications-page.service";

/** Refresh CMS-driven policy content without a full redeploy. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPolicyCertificationsPage();
    return constructMetadata({
      title: page.seo?.metaTitle ?? page.pageTitle,
      description:
        page.seo?.metaDescription ??
        "Review Sunny Diamonds privacy policy, terms, certifications, and business policies including returns, cancellations, and gift vouchers.",
      canonicalPath: page.seo?.canonicalPath ?? POLICY_AND_CERTIFICATIONS_PATH,
      ...(page.seo?.keywords ? { keywords: page.seo.keywords } : {}),
      ...(page.seo?.ogImageUrl ? { image: page.seo.ogImageUrl } : {}),
    });
  } catch {
    return constructMetadata({
      title: "Policy & Certifications",
      description:
        "Review Sunny Diamonds privacy policy, terms, certifications, and business policies including returns, cancellations, and gift vouchers.",
      canonicalPath: POLICY_AND_CERTIFICATIONS_PATH,
    });
  }
}

async function PolicyPageContent() {
  let page = EMPTY_POLICY_CERTIFICATIONS_PAGE;

  try {
    page = await getPolicyCertificationsPage();
  } catch {
    page = EMPTY_POLICY_CERTIFICATIONS_PAGE;
  }

  return (
    <PolicyCertificationsPage
      page={page}
      initialPolicyId={page.defaultPolicyId}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PolicyPageContent />
    </Suspense>
  );
}
