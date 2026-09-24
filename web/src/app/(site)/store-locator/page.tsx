import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { siteConfig } from "@/shared/lib/siteConfig";
import BookStoreVisitPageContent from "@/features/stores/components/BookStoreVisitPageContent";
import StoreLocatorPageSkeleton from "@/features/stores/components/skeletons/StoreLocatorPageSkeleton";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { mapStoreLocatorShowroomToBookStoreVisit } from "@/features/products/utils/bookStoreVisitStores";
import { buildStoreLocatorJsonLd } from "@/shared/lib/seo/storeLocatorSeo";
import { getStoreLocatorPage } from "@/services/store-locator/store-locator-page.service";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getStoreLocatorPage();
    const seo = page.seo;

    if (!seo?.metaTitle && !seo?.metaDescription) {
      return constructMetadata({
        title: page.hero?.title ?? siteConfig.brand.name,
        description: page.hero?.subtitle ?? siteConfig.seo.defaultDescription,
        canonicalPath: seo?.canonicalPath ?? "/store-locator",
      });
    }

    return constructMetadata({
      title: seo.metaTitle ?? page.hero?.title ?? siteConfig.brand.name,
      description: seo.metaDescription ?? page.hero?.subtitle ?? siteConfig.seo.defaultDescription,
      ...(seo.canonicalPath ? { canonicalPath: seo.canonicalPath } : { canonicalPath: "/store-locator" }),
      ...(seo.metaKeywords ? { keywords: seo.metaKeywords } : {}),
      ...(seo.ogImageUrl ? { image: seo.ogImageUrl } : {}),
    });
  } catch {
    return constructMetadata({
      title: siteConfig.brand.name,
      description: siteConfig.seo.defaultDescription,
      canonicalPath: "/store-locator",
    });
  }
}

async function StoreLocatorPageContent() {
  const page = await getStoreLocatorPage();
  const stores = (page.showrooms ?? []).map(mapStoreLocatorShowroomToBookStoreVisit);
  const storeLocatorJsonLd = buildStoreLocatorJsonLd(stores);

  return (
    <>
      {storeLocatorJsonLd ? <JsonLd data={storeLocatorJsonLd} id="store-locator-jsonld" /> : null}
      <BookStoreVisitPageContent page={page} />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<StoreLocatorPageSkeleton />}>
      <StoreLocatorPageContent />
    </Suspense>
  );
}
