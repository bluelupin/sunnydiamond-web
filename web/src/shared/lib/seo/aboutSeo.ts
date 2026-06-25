import { seoContent } from "@/features/cms/data/content";
import { siteConfig } from "@/shared/lib/siteConfig";
import type { NormalizedAboutPage } from "@/services/about/about-page.types";

export function resolveAboutSeoMetadata(page: NormalizedAboutPage | null) {
  const cmsSeo = page?.seo;

  return {
    title: cmsSeo?.metaTitle ?? seoContent.about.title,
    description: cmsSeo?.metaDescription ?? seoContent.about.description,
    canonicalPath: cmsSeo?.canonicalPath ?? "/about",
    keywords: cmsSeo?.metaKeywords,
  };
}

export function buildAboutJsonLd(page: NormalizedAboutPage | null) {
  const { title, description, canonicalPath } = resolveAboutSeoMetadata(page);
  const path = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description,
    url: `${siteConfig.seo.siteUrl}${path}`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.brand.name,
      description,
      foundingDate: "1997",
    },
  };
}
