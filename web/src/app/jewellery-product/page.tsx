import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JewelleryProductPage from "@/features/jewellery-product/components/JewelleryProductPage";

export const metadata: Metadata = constructMetadata({
  title: "Handcrafted Brilliance",
  description:
    "Explore Sunny Diamonds jewellery collections including rings, earrings, necklaces, pendants, bracelets, bangles, and nosepins.",
  canonicalPath: "/jewellery-product",
});

export default function Page() {
  return <JewelleryProductPage />;
}
