import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { siteConfig } from "@/shared/lib/siteConfig";
import CareersPage from "@/features/careers/components/CareersPage";
import CareersPageSkeleton from "@/features/careers/components/skeletons/CareersPageSkeleton";
import { CAREERS_ROUTE } from "@/features/careers/constants/careersRoutes";
import {
  EMPTY_CAREERS_PAGE_DATA,
  getCareersPageData,
} from "@/services/careers/careers.service";
import { resolveCareersSeoMetadata } from "@/shared/lib/seo/careersSeo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const cms = await getCareersPageData();
    const seo = resolveCareersSeoMetadata(cms);

    if (!seo) {
      throw new Error("Careers SEO unavailable");
    }

    return {
      ...constructMetadata({
        title: seo.title,
        description: seo.description,
        canonicalPath: seo.canonicalPath,
        ...(seo.image ? { image: seo.image } : {}),
      }),
      ...(seo.keywords ? { keywords: seo.keywords } : {}),
    };
  } catch {
    return constructMetadata({
      title: siteConfig.brand.name,
      description: siteConfig.seo.defaultDescription,
      canonicalPath: CAREERS_ROUTE,
    });
  }
}

async function CareersPageContent() {
  let cms = EMPTY_CAREERS_PAGE_DATA;

  try {
    cms = await getCareersPageData();
  } catch {
    cms = EMPTY_CAREERS_PAGE_DATA;
  }

  return <CareersPage cms={cms} />;
}

export default function Page() {
  return (
    <Suspense fallback={<CareersPageSkeleton />}>
      <CareersPageContent />
    </Suspense>
  );
}
