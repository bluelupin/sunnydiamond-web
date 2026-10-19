import { seoContent } from "@/features/cms/data/content";
import { normalizeCanonicalPath } from "@/shared/lib/seo/normalizeCanonicalPath";
import { siteConfig } from "@/shared/lib/siteConfig";
import { WORLD_OF_SUNNY_PATH } from "@/shared/utils/navigation";
import type { NormalizedAboutPage } from "@/services/about/about-page.types";

export function resolveAboutOpenGraphImage(page: NormalizedAboutPage | null): string | undefined {
  const heroImage = page?.hero?.image;
  const candidate =
    heroImage?.desktopUrl?.trim() || heroImage?.mobileUrl?.trim() || undefined;
  return candidate;
}

export function resolveAboutSeoMetadata(page: NormalizedAboutPage | null) {
  const cmsSeo = page?.seo;
  const normalizedCanonical = normalizeCanonicalPath(
    cmsSeo?.canonicalPath,
    WORLD_OF_SUNNY_PATH,
  );
  const canonicalPath =
    normalizedCanonical === "/about" ? WORLD_OF_SUNNY_PATH : normalizedCanonical;

  const cmsTitle = cmsSeo?.metaTitle?.trim();
  const cmsDescription = cmsSeo?.metaDescription?.trim();
  const image = resolveAboutOpenGraphImage(page);

  return {
    // Prefer CMS exactly; static fallbacks only when CMS SEO is missing.
    title: cmsTitle || seoContent.about.title,
    description: cmsDescription || seoContent.about.description,
    canonicalPath,
    keywords: cmsSeo?.metaKeywords,
    ...(image ? { image } : {}),
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
