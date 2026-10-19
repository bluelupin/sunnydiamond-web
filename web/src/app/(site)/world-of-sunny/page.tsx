import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { seoContent } from "@/features/cms/data/content";
import AboutDocumentPreload from "@/features/about/components/AboutDocumentPreload";
import AboutPageView from "@/features/about/components/AboutPage";
import AboutPageSkeleton from "@/features/about/components/skeletons/AboutPageSkeleton";
import {
  getAboutPage,
  EMPTY_ABOUT_PAGE,
} from "@/services/about/about-page.service";
import { buildAboutJsonLd, resolveAboutSeoMetadata } from "@/shared/lib/seo/aboutSeo";
import { WORLD_OF_SUNNY_PATH } from "@/shared/utils/navigation";

/** Refresh CMS-driven about content without a full redeploy. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getAboutPage();
    const { title, description, canonicalPath, keywords, image } =
      resolveAboutSeoMetadata(page);

    return constructMetadata({
      title,
      description,
      canonicalPath,
      ...(keywords ? { keywords } : {}),
      ...(image ? { image } : {}),
    });
  } catch {
    return constructMetadata({
      title: seoContent.about.title,
      description: seoContent.about.description,
      canonicalPath: WORLD_OF_SUNNY_PATH,
    });
  }
}

async function WorldOfSunnyPageContent() {
  let page = EMPTY_ABOUT_PAGE;

  try {
    page = await getAboutPage();
  } catch {
    page = EMPTY_ABOUT_PAGE;
  }

  return (
    <>
      <AboutDocumentPreload page={page} />
      <JsonLd data={buildAboutJsonLd(page)} />
      <AboutPageView page={page} />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<AboutPageSkeleton />}>
      <WorldOfSunnyPageContent />
    </Suspense>
  );
}
