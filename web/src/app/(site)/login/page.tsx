import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import AuthStandalonePage from "@/features/auth/components/AuthStandalonePage";
import { sanitizeReturnUrl } from "@/features/auth/utils/authNavigation";

export const metadata: Metadata = constructMetadata({
  title: seoContent.login.title,
  description: seoContent.login.description,
  canonicalPath: "/login",
  noIndex: true,
});

type LoginPageProps = {
  searchParams: Promise<{ returnUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const returnUrl = sanitizeReturnUrl(params.returnUrl);

  return <AuthStandalonePage returnUrl={returnUrl} />;
}
