import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import StaticRoutePage from "@/features/cms/components/StaticRoutePage";

const page = footerPages.oldGoldPurchasePolicy;

export const metadata: Metadata = constructMetadata({
  title: page.title,
  description: page.description,
  canonicalPath: "/old-gold-purchase-policy-kerala-only",
});

export default function Page() {
  return <StaticRoutePage title={page.title} description={page.description} />;
}
