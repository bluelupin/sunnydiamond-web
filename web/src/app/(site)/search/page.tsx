import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import JewelleryProductPage from "@/features/jewellery-product/components/JewelleryProductPage";
import SearchNoResults from "@/features/search/SearchNoResults";
import { cleanSearchQuery } from "@/features/search/quickSearch";
import { getProductLandingPage } from "@/services/product-landing/product-landing-page.service";
import { constructMetadata } from "@/shared/lib/seo/metadata";

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

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
  const query = await readQuery(searchParams);
  if (!query) {
    redirect("/jewellery");
  }

  const landing = await getProductLandingPage();

  return (
    <Suspense fallback={null}>
      <JewelleryProductPage
        key={query}
        searchQuery={query}
        hero={landing.hero}
        trustBadges={landing.trustBadges}
        listingCards={landing.listingCards}
        noResults={<SearchNoResults query={query} />}
      />
    </Suspense>
  );
}
