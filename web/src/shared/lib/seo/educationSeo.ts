import { siteConfig } from "@/shared/lib/siteConfig";
import type { NormalizedLearnAboutDiamondsPage } from "@/services/education/learn-about-diamonds-page.types";
import { buildFaqPageJsonLd } from "@/shared/lib/seo/schema/faqPage";

export function resolveEducationSeoMetadata(page: NormalizedLearnAboutDiamondsPage | null) {
  const cmsSeo = page?.seo;

  if (!cmsSeo) {
    return {
      title: siteConfig.brand.name,
      description: siteConfig.seo.defaultDescription,
      canonicalPath: "/education",
      keywords: undefined,
      image: undefined,
    };
  }

  return {
    title: cmsSeo.metaTitle,
    description: cmsSeo.metaDescription,
    canonicalPath: cmsSeo.canonicalPath,
    keywords: cmsSeo.metaKeywords,
    image: cmsSeo.ogImageUrl,
  };
}

export function buildEducationJsonLd(page: NormalizedLearnAboutDiamondsPage | null) {
  const { title, description, canonicalPath } = resolveEducationSeoMetadata(page);
  const path = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;

  const webPage = {
    "@type": "WebPage",
    name: title,
    description,
    url: `${siteConfig.seo.siteUrl}${path}`,
  };

  const faqItems =
    page?.faq?.items.map((item) => ({
      question: item.question,
      answer: item.answer,
    })) ?? [];

  const faqPage = buildFaqPageJsonLd(faqItems);
  const graph = faqPage ? [webPage, faqPage] : [webPage];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
