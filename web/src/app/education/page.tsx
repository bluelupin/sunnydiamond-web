import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { footerPages } from "@/features/cms/data/footerPages";
import { siteConfig } from "@/shared/lib/siteConfig";
import EducationPage from "@/features/education/components/EducationPage";

const page = footerPages.education;

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

export default function Page() {
  return (
    <>
      <JsonLd data={educationJsonLd} />
      <EducationPage />
    </>
  );
}
