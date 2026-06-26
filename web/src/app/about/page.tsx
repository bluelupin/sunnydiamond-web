import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { seoContent } from "@/features/cms/data/content";
import AboutPageView from "@/features/about/components/AboutPage";
import AboutPageSkeleton from "@/features/about/components/skeletons/AboutPageSkeleton";
import {
  getAboutPage,
  EMPTY_ABOUT_PAGE,
} from "@/services/about/about-page.service";
import { buildAboutJsonLd, resolveAboutSeoMetadata } from "@/shared/lib/seo/aboutSeo";

/** Refresh CMS-driven about content without a full redeploy. */
// export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getAboutPage();
    const { title, description, canonicalPath } = resolveAboutSeoMetadata(page);

    return constructMetadata({
      title,
      description,
      canonicalPath,
    });
  } catch {
    return constructMetadata({
      title: seoContent.about.title,
      description: seoContent.about.description,
      canonicalPath: "/about",
    });
  }
}

async function AboutPageContent() {
  let page = EMPTY_ABOUT_PAGE;

  try {
    page = await getAboutPage();
  } catch {
    page = EMPTY_ABOUT_PAGE;
  }

  return (
    <>
      <JsonLd data={buildAboutJsonLd(page)} />
      <AboutPageView page={page} />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<AboutPageSkeleton />}>
      <AboutPageContent />
    </Suspense>
  );
}
