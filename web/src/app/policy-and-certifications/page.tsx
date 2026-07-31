import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import PolicyCertificationsPage from "@/features/cms/components/policy/PolicyCertificationsPage";
import { policyCertificationsContent } from "@/features/cms/data/policyCertificationsContent";
import { POLICY_AND_CERTIFICATIONS_PATH } from "@/shared/utils/navigation";

export const metadata: Metadata = constructMetadata({
  title: policyCertificationsContent.pageTitle,
  description:
    "Review Sunny Diamonds privacy policy, terms, certifications, and business policies including returns, cancellations, and gift vouchers.",
  canonicalPath: POLICY_AND_CERTIFICATIONS_PATH,
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PolicyCertificationsPage initialPolicyId="privacy-policy" />
    </Suspense>
  );
}
