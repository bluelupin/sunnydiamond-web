import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import BookStoreVisitPageContent from "@/features/stores/components/BookStoreVisitPageContent";

const page = footerPages.storeLocator;

export const metadata: Metadata = constructMetadata({
  title: page.title,
  description: page.description,
  canonicalPath: "/store-locator",
});

export default function Page() {
  return <BookStoreVisitPageContent />;
}
