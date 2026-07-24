import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import GiftingPage from "@/features/gifting/components/GiftingPage";

const fallback = footerPages.gifting;

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: fallback.title,
    description: fallback.description,
    canonicalPath: "/gifting",
  });
}

export default function Page() {
  return <GiftingPage />;
}
