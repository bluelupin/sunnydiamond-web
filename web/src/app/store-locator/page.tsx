import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import BookStoreVisitPageContent from "@/features/stores/components/BookStoreVisitPageContent";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { BOOK_STORE_VISIT_STORES } from "@/features/products/data/bookStoreVisitContent";
import { buildStoreLocatorJsonLd } from "@/shared/lib/seo/storeLocatorSeo";

const page = footerPages.storeLocator;

export const metadata: Metadata = constructMetadata({
  title: page.title,
  description: page.description,
  canonicalPath: "/store-locator",
});

export default function Page() {
  const storeLocatorJsonLd = buildStoreLocatorJsonLd(BOOK_STORE_VISIT_STORES);

  return (
    <>
      {storeLocatorJsonLd ? <JsonLd data={storeLocatorJsonLd} id="store-locator-jsonld" /> : null}
      <BookStoreVisitPageContent />
    </>
  );
}
