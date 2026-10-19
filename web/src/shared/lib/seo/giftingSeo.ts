import { footerPages } from "@/features/cms/data/footerPages";
import type { NormalizedGiftingPage } from "@/services/gifting/gifting-page.types";

const fallback = footerPages.gifting;

export function resolveGiftingOpenGraphImage(
  page: NormalizedGiftingPage | null,
): string | undefined {
  const cmsOg = page?.seo?.ogImageUrl?.trim();
  if (cmsOg) return cmsOg;

  const heroImage = page?.hero?.image;
  return heroImage?.desktopUrl?.trim() || heroImage?.mobileUrl?.trim() || undefined;
}

export function resolveGiftingSeoMetadata(page: NormalizedGiftingPage | null) {
  const seo = page?.seo;
  const image = resolveGiftingOpenGraphImage(page);

  return {
    title: seo?.metaTitle || page?.hero?.title || fallback.title,
    description: seo?.metaDescription || fallback.description,
    canonicalPath: seo?.canonicalPath || "/gifting",
    keywords: seo?.metaKeywords,
    ...(image ? { image } : {}),
  };
}
