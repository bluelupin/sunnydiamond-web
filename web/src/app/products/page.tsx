import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { seoContent } from "@/data/content";
import ProductsPageView from "@/components/site-pages/ProductsPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.products.title,
  description: seoContent.products.description,
});

export default function Page() {
  return <ProductsPageView />;
}
