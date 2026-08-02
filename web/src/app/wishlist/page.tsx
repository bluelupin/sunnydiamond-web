import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import WishlistPageView from "@/features/wishlist/components/WishlistPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.wishlist.title,
  description: seoContent.wishlist.description,
  canonicalPath: "/wishlist",
  noIndex: true,
});

export default function Page() {
  return <WishlistPageView />;
}
