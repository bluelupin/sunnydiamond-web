import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import CartPageView from "@/features/cart/components/CartPage";
import { getProductDisplayPage } from "@/services/product-display/product-display-page.service";

export const metadata: Metadata = constructMetadata({
  title: seoContent.cart.title,
  description: seoContent.cart.description,
  canonicalPath: "/cart",
  noIndex: true,
});

export default async function Page() {
  const { strip } = await getProductDisplayPage();

  return <CartPageView benefitsStrip={strip} />;
}
