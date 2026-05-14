import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { seoContent } from "@/data/content";
import CartPageView from "@/components/site-pages/CartPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.cart.title,
  description: seoContent.cart.description,
});

export default function Page() {
  return <CartPageView />;
}
