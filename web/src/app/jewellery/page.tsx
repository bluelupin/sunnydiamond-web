import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import {
  buildJewelleryListingJsonLd,
  resolveJewellerySeoMetadata,
} from "@/shared/lib/seo/jewellerySeo";
import { buildJewelleryListingBreadcrumbJsonLd } from "@/shared/lib/seo/schema/breadcrumb";
import { getProductLandingPage } from "@/services/product-landing/product-landing-page.service";
import { prefetchJewelleryListing } from "@/lib/magento/prefetchMagento";
import { hasGiftFinderSearchParams } from "@/features/gifting/utils/giftFinderRoutes";
import JewelleryProductPage from "@/features/jewellery-product/components/JewelleryProductPage";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { resolveImageSrcString } from "@/shared/utils/image";

type PageProps = {
  searchParams: Promise<{
    occasion?: string;
    diamondShape?: string;
    fancyColour?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const query = await searchParams;
  const page = await getProductLandingPage();
  const { title, description, canonicalPath, keywords, image } =
    resolveJewellerySeoMetadata(page);

  return constructMetadata({
    title,
    description,
    canonicalPath,
    keywords,
    ...(image ? { image } : {}),
    noIndex: hasGiftFinderSearchParams(query) || Boolean(query.category),
  });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialListing = hasGiftFinderSearchParams(params)
    ? undefined
    : await prefetchJewelleryListing(null);
  const page = await getProductLandingPage();
  const seo = resolveJewellerySeoMetadata(page);

  const jsonLdProducts =
    initialListing?.products.map((product) => ({
      name: product.name,
      urlKey: product.urlKey,
      image: resolveImageSrcString(product.primaryImage),
    })) ?? [];

  return (
    <>
      <JsonLd data={buildJewelleryListingBreadcrumbJsonLd()} id="jewellery-breadcrumb-jsonld" />
      <JsonLd
        data={buildJewelleryListingJsonLd({
          name: seo.title,
          description: seo.description,
          canonicalPath: seo.canonicalPath,
          products: jsonLdProducts,
        })}
        id="jewellery-listing-jsonld"
      />
      <Suspense fallback={null}>
        <JewelleryProductPage
          initialListing={initialListing}
          prefetchedCategoryUrlKey={initialListing ? null : undefined}
        />
      </Suspense>
    </>
  );
}
