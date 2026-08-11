import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { siteConfig } from "@/shared/lib/siteConfig";
import CareersAllOpeningsPage from "@/features/careers/components/CareersAllOpeningsPage";
import CareersPageSkeleton from "@/features/careers/components/skeletons/CareersPageSkeleton";
import { CAREERS_ALL_OPENINGS_ROUTE } from "@/features/careers/constants/careersRoutes";
import {
  EMPTY_CAREERS_PAGE_DATA,
  getCareersPageData,
} from "@/services/careers/careers.service";
import { resolveCareersAllOpeningsSeoMetadata } from "@/shared/lib/seo/careersSeo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const cms = await getCareersPageData();
    const seo = resolveCareersAllOpeningsSeoMetadata(cms);

    if (!seo) {
      throw new Error("Careers listings SEO unavailable");
    }

    return constructMetadata({
      title: seo.title || `All Openings | ${siteConfig.brand.name}`,
      description: seo.description,
      canonicalPath: seo.canonicalPath,
      ...(seo.keywords ? { keywords: seo.keywords } : {}),
      ...(seo.image ? { image: seo.image } : {}),
    });
  } catch {
    return constructMetadata({
      title: `All Openings | ${siteConfig.brand.name}`,
      description: siteConfig.seo.defaultDescription,
      canonicalPath: CAREERS_ALL_OPENINGS_ROUTE,
    });
  }
}

async function CareersAllOpeningsPageContent() {
  let cms = EMPTY_CAREERS_PAGE_DATA;

  try {
    cms = await getCareersPageData();
  } catch {
    cms = EMPTY_CAREERS_PAGE_DATA;
  }

  return <CareersAllOpeningsPage cms={cms} />;
}

export default function Page() {
  return (
    <Suspense fallback={<CareersPageSkeleton />}>
      <CareersAllOpeningsPageContent />
    </Suspense>
  );
}
