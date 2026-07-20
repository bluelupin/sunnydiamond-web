import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { footerPages } from "@/features/cms/data/footerPages";
import EducationPage from "@/features/education/components/EducationPage";
import EducationPageSkeleton from "@/features/education/components/skeletons/EducationPageSkeleton";
import {
  EMPTY_LEARN_ABOUT_DIAMONDS_PAGE,
  getLearnAboutDiamondsPage,
} from "@/services/education/learn-about-diamonds-page.service";
import {
  buildEducationJsonLd,
  resolveEducationSeoMetadata,
} from "@/shared/lib/seo/educationSeo";

const fallback = footerPages.education;

/** Refresh CMS-driven sections without a full redeploy. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getLearnAboutDiamondsPage();
    const { title, description, canonicalPath, keywords, image } =
      resolveEducationSeoMetadata(page);

    return {
      ...constructMetadata({
        title,
        description,
        canonicalPath,
        ...(image ? { image } : {}),
      }),
      ...(keywords ? { keywords } : {}),
    };
  } catch {
    return constructMetadata({
      title: fallback.title,
      description: fallback.description,
      canonicalPath: "/education",
    });
  }
}

async function EducationPageContent() {
  let cmsPage = EMPTY_LEARN_ABOUT_DIAMONDS_PAGE;

  try {
    cmsPage = await getLearnAboutDiamondsPage();
  } catch {
    cmsPage = EMPTY_LEARN_ABOUT_DIAMONDS_PAGE;
  }

  return (
    <>
      <JsonLd data={buildEducationJsonLd(cmsPage)} />
      <EducationPage
        hero={cmsPage.hero}
        faq={cmsPage.faq}
        ctaBanner={cmsPage.ctaBanner}
        fourCsIntro={cmsPage.fourCsIntro}
        fourCs={cmsPage.fourCs}
        certificate={cmsPage.certificate}
        learnMore={cmsPage.learnMore}
      />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<EducationPageSkeleton />}>
      <EducationPageContent />
    </Suspense>
  );
}
