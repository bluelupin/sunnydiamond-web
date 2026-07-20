import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import BespokePage from "@/features/bespoke/components/BespokePage";

const page = footerPages.bespokeJewellery;

export const metadata: Metadata = constructMetadata({
  title: page.title,
  description: page.description,
});

export default function Page() {
  return <BespokePage />;
}
