import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { footerPages } from "@/features/cms/data/footerPages";
import { siteConfig } from "@/shared/lib/siteConfig";
import EducationPage from "@/features/education/components/EducationPage";
import {
  EMPTY_LEARN_ABOUT_DIAMONDS_PAGE,
  getLearnAboutDiamondsPage,
} from "@/services/education/learn-about-diamonds-page.service";

const page = footerPages.education;

/** Refresh CMS-driven sections without a full redeploy. */
export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: page.title,
  description: page.description,
  canonicalPath: "/education",
});

const educationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: page.title,
  description: page.description,
  url: `${siteConfig.seo.siteUrl}/education`,
};

export default async function Page() {
  let cmsPage = EMPTY_LEARN_ABOUT_DIAMONDS_PAGE;

  try {
    cmsPage = await getLearnAboutDiamondsPage();
  } catch {
    cmsPage = EMPTY_LEARN_ABOUT_DIAMONDS_PAGE;
  }

  return (
    <>
      <JsonLd data={educationJsonLd} />
      <EducationPage
        hero={cmsPage.hero}
        faq={cmsPage.faq}
        ctaBanner={cmsPage.ctaBanner}
        fourCs={cmsPage.fourCs}
        certificate={cmsPage.certificate}
      />
    </>
  );
}
