import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { siteConfig } from "@/shared/lib/siteConfig";
import DiamondsForEveryonePage from "@/features/diamonds-for-everyone/components/DiamondsForEveryonePage";
import DiamondsForEveryonePageSkeleton from "@/features/diamonds-for-everyone/components/skeletons/DiamondsForEveryonePageSkeleton";
import { getDiamondsForEveryonePage } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.service";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getDiamondsForEveryonePage();
    const seo = page.seo;

    if (!seo?.metaTitle && !seo?.metaDescription) {
      return constructMetadata({
        title: siteConfig.brand.name,
        description: siteConfig.seo.defaultDescription,
        canonicalPath: "/diamonds-for-everyone",
      });
    }

    return constructMetadata({
      title: seo.metaTitle ?? siteConfig.brand.name,
      description: seo.metaDescription ?? siteConfig.seo.defaultDescription,
      ...(seo.canonicalPath ? { canonicalPath: seo.canonicalPath } : {}),
      ...(seo.metaKeywords ? { keywords: seo.metaKeywords } : {}),
      ...(seo.ogImageUrl ? { image: seo.ogImageUrl } : {}),
    });
  } catch {
    return constructMetadata({
      title: siteConfig.brand.name,
      description: siteConfig.seo.defaultDescription,
      canonicalPath: "/diamonds-for-everyone",
    });
  }
}

async function DiamondsForEveryonePageContent() {
  const page = await getDiamondsForEveryonePage();
  return <DiamondsForEveryonePage page={page} />;
}

export default function Page() {
  return (
    <Suspense fallback={<DiamondsForEveryonePageSkeleton />}>
      <DiamondsForEveryonePageContent />
    </Suspense>
  );
}
