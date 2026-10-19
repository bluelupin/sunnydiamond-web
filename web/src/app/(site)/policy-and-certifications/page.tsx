import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { resolvePolicySeoMetadata } from "@/shared/lib/seo/policySeo";
import PolicyCertificationsPage from "@/features/cms/components/policy/PolicyCertificationsPage";
import { resolvePolicyIdFromSearchParams } from "@/features/cms/utils/resolvePolicySearchParam";
import { POLICY_AND_CERTIFICATIONS_PATH } from "@/shared/utils/navigation";
import {
  EMPTY_POLICY_CERTIFICATIONS_PAGE,
  getPolicyCertificationsPage,
} from "@/services/policy/policy-certifications-page.service";
import { resolveActivePolicyId } from "@/services/policy/policy-certifications-page.mapper";

/** Refresh CMS-driven policy content without a full redeploy. */
export const revalidate = 300;

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPolicyCertificationsPage();
    const { title, description, canonicalPath, keywords, image } = resolvePolicySeoMetadata(page);

    return constructMetadata({
      title: title || "Sunny Diamonds",
      description,
      canonicalPath,
      ...(keywords ? { keywords } : {}),
      ...(image ? { image } : {}),
    });
  } catch {
    return constructMetadata({
      title: "Sunny Diamonds",
      canonicalPath: POLICY_AND_CERTIFICATIONS_PATH,
    });
  }
}

async function PolicyPageContent({
  policyIdFromQuery,
}: {
  policyIdFromQuery?: string;
}) {
  let page = EMPTY_POLICY_CERTIFICATIONS_PAGE;

  try {
    page = await getPolicyCertificationsPage();
  } catch {
    page = EMPTY_POLICY_CERTIFICATIONS_PAGE;
  }

  const initialPolicyId = resolveActivePolicyId(page, policyIdFromQuery);

  return (
    <PolicyCertificationsPage
      page={page}
      initialPolicyId={initialPolicyId}
      initialMobileShowDetail={Boolean(policyIdFromQuery)}
    />
  );
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const policyIdFromQuery = resolvePolicyIdFromSearchParams(resolvedSearchParams);

  return (
    <Suspense fallback={null}>
      <PolicyPageContent policyIdFromQuery={policyIdFromQuery} />
    </Suspense>
  );
}
