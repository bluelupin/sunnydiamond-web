import { footerPages } from "@/features/cms/data/footerPages";
import { siteConfig } from "@/shared/lib/siteConfig";
import type { NormalizedLearnAboutDiamondsPage } from "@/services/education/learn-about-diamonds-page.types";
import { buildFaqPageJsonLd } from "@/shared/lib/seo/schema/faqPage";

const fallback = footerPages.education;

export function resolveEducationSeoMetadata(page: NormalizedLearnAboutDiamondsPage | null) {
  const cmsSeo = page?.seo;

  return {
    title: cmsSeo?.metaTitle ?? fallback.title,
    description: cmsSeo?.metaDescription ?? fallback.description,
    canonicalPath: cmsSeo?.canonicalPath ?? "/education",
    keywords: cmsSeo?.metaKeywords,
    image: cmsSeo?.ogImageUrl,
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
