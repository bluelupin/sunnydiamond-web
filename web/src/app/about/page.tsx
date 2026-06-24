import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { seoContent } from "@/features/cms/data/content";
import { siteConfig } from "@/shared/lib/siteConfig";
import AboutPageView from "@/features/about/components/AboutPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.about.title,
  description: seoContent.about.description,
  canonicalPath: "/about",
});

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: seoContent.about.title,
  description: seoContent.about.description,
  url: `${siteConfig.seo.siteUrl}/about`,
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.brand.name,
    description: seoContent.about.description,
    foundingDate: "1997",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <AboutPageView />
    </>
  );
}
