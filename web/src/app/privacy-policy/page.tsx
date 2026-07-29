import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import PolicyCertificationsPage from "@/features/cms/components/policy/PolicyCertificationsPage";
import { policyCertificationsContent } from "@/features/cms/data/policyCertificationsContent";

export const metadata: Metadata = constructMetadata({
  title: policyCertificationsContent.pageTitle,
  description:
    "Review Sunny Diamonds privacy policy, terms, certifications, and business policies including returns, cancellations, and gift vouchers.",
  canonicalPath: "/privacy-policy",
});

export default function Page() {
  return <PolicyCertificationsPage initialPolicyId="privacy-policy" />;
}
