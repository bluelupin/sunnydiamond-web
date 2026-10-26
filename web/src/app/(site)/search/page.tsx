import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import JewelleryProductPage from "@/features/jewellery-product/components/JewelleryProductPage";
import JewelleryHeroSection from "@/features/jewellery-product/components/JewelleryHeroSection";
import SearchNoResults from "@/features/search/SearchNoResults";
import { cleanSearchQuery } from "@/features/search/quickSearch";
import { getProductLandingPage } from "@/services/product-landing/product-landing-page.service";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { getMagentoJewelleryInitialListing } from "@/services/magento/products/products.service";
import { createEmptyFilterState } from "@/features/jewellery-product/data/filters";

type SearchParams = { q?: string | string[]; [key: string]: string | string[] | undefined };
type PageProps = { searchParams: Promise<SearchParams> };

async function readQuery(searchParams: PageProps["searchParams"]): Promise<string> {
  const { q } = await searchParams;
  return cleanSearchQuery(Array.isArray(q) ? q[0] : q);
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const query = await readQuery(searchParams);
  return constructMetadata({
    title: query ? `Results for "${query}"` : "Search",
    description: "Search Sunny Diamonds jewellery.",
    canonicalPath: "/search",
    noIndex: true,
  });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = cleanSearchQuery(Array.isArray(params.q) ? params.q[0] : params.q);
  if (!query) {
    redirect("/jewellery");
  }

  // Query variants keep their existing client filter flow until server filters match it.
  const plainSearch = Object.keys(params).every((key) => key === "q");
  const [landing, initialListingResult] = await Promise.all([
    getProductLandingPage(),
    plainSearch
      ? getMagentoJewelleryInitialListing({
          search: query,
          categoryUrlKey: null,
          sortValue: "featured",
          filters: createEmptyFilterState(),
          includeFacets: true,
        }).catch(() => null)
      : Promise.resolve(null),
  ]);
  const initialListing = initialListingResult?.listing;

  return (
    <>
      {landing.hero ? <JewelleryHeroSection {...landing.hero} /> : null}
      <Suspense fallback={null}>
        <JewelleryProductPage
          key={query}
          searchQuery={query}
          initialListing={initialListing}
          prefetchedCategoryUrlKey={initialListing ? null : undefined}
          trustBadges={landing.trustBadges}
          listingCards={landing.listingCards}
          noResults={<SearchNoResults query={query} />}
        />
      </Suspense>
    </>
  );
}
