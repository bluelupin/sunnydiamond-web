import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { seoContent } from "@/data/content";
import CheckoutPageView from "@/components/site-pages/CheckoutPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.checkout.title,
  description: seoContent.checkout.description,
});

export default function Page() {
  return <CheckoutPageView />;
}
