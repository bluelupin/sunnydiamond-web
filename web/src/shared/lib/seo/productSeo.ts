export type ProductSeo = {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  canonicalPath: string;
};

type BuildProductSeoParams = {
  name: string;
  urlKey: string;
  shortDescription: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
};

export function buildProductSeo({
  name,
  urlKey,
  shortDescription,
  metaTitle,
  metaDescription,
  metaKeywords,
  canonicalUrl,
}: BuildProductSeoParams): ProductSeo {
  const resolvedShortDescription = shortDescription.trim() || name;

  return {
    title: metaTitle?.trim() || name,
    description: metaDescription?.trim() || resolvedShortDescription,
    keywords: metaKeywords?.trim() || undefined,
    canonicalUrl: canonicalUrl?.trim() || undefined,
    canonicalPath: `/product/${urlKey}`,
  };
}
