import type { Metadata } from "next";
import { footerPages } from "@/features/cms/data/footerPages";
import GiftCardPage from "@/features/gift-card/components/GiftCardPage";
import { constructMetadata } from "@/shared/lib/seo/metadata";

const fallback = footerPages.gifting;

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: "Gift Card",
    description: fallback.description,
    canonicalPath: "/gift-card",
  });
}

export default function Page() {
  return <GiftCardPage />;
}
