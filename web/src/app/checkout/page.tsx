import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import CheckoutPageView from "@/features/checkout/components/CheckoutPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.checkout.title,
  description: seoContent.checkout.description,
  canonicalPath: "/checkout",
  noIndex: true,
});

export default function Page() {
  return <CheckoutPageView />;
}
