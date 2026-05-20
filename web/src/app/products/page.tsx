import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import ProductsPageView from "@/features/products/components/ProductsPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.products.title,
  description: seoContent.products.description,
});

export default function Page() {
  return <ProductsPageView />;
}
