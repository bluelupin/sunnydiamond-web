import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import BookStoreVisitPageContent from "@/features/stores/components/BookStoreVisitPageContent";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { mapStoreLocatorShowroomToBookStoreVisit } from "@/features/products/utils/bookStoreVisitStores";
import { buildStoreLocatorJsonLd } from "@/shared/lib/seo/storeLocatorSeo";
import {
  EMPTY_STORE_LOCATOR_PAGE,
  getStoreLocatorPage,
} from "@/services/store-locator/store-locator-page.service";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStoreLocatorPage();
  const seo = page.seo;

  return constructMetadata({
    title: seo?.metaTitle || page.hero?.title || "",
    description: seo?.metaDescription || page.hero?.subtitle || undefined,
    canonicalPath: seo?.canonicalPath || "/store-locator",
    ...(seo?.metaKeywords ? { keywords: seo.metaKeywords } : {}),
    ...(seo?.ogImageUrl ? { image: seo.ogImageUrl } : {}),
  });
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
    <Suspense fallback={<BookStoreVisitPageContent page={EMPTY_STORE_LOCATOR_PAGE} isShowroomsLoading />}>
      <StoreLocatorPageContent />
    </Suspense>
  );
}
