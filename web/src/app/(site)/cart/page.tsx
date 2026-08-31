import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import CartPageView from "@/features/cart/components/CartPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.cart.title,
  description: seoContent.cart.description,
  canonicalPath: "/cart",
  noIndex: true,
});

export default function Page() {
  return <CartPageView />;
}
