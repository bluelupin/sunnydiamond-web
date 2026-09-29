import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import JewelleryProductPage from "@/features/jewellery-product/components/JewelleryProductPage";
import SearchNoResults from "@/features/search/SearchNoResults";
import { cleanSearchQuery } from "@/features/search/quickSearch";
import { getContactPage } from "@/services/contact/contact-page.service";
import {
  getMagentoTrendingProducts,
  mapJewelleryListingToFeaturedCarouselItems,
} from "@/services/magento/products/trendingProducts.service";
import { getProductLandingPage } from "@/services/product-landing/product-landing-page.service";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import PageContainer from "@/shared/ui/layout/PageContainer";

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

  const [landing, contact, trending] = await Promise.all([
    getProductLandingPage(),
    getContactPage(),
    getMagentoTrendingProducts(8).catch(() => []),
  ]);
  const advisorHref = contact.infoCards
    .map((card) => card.link.href)
    .find((href) => href && /wa\.me|whatsapp/i.test(href));

  return (
    <>
      <PageContainer className="pb-6 pt-10 lg:pb-10 lg:pt-16">
        <h1 className="font-larken text-32 font-light leading-110 text-darkblack lg:text-48">
          Results for &lsquo;{query}&rsquo;
        </h1>
      </PageContainer>
      <Suspense fallback={null}>
        <JewelleryProductPage
          key={query}
          searchQuery={query}
          trustBadges={landing.trustBadges}
          noResults={
            <SearchNoResults
              query={query}
              bestsellers={mapJewelleryListingToFeaturedCarouselItems(trending)}
              advisorHref={advisorHref}
            />
          }
        />
      </Suspense>
    </>
  );
}
