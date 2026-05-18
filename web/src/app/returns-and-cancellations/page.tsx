import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { footerPages } from "@/data/footerPages";
import StaticRoutePage from "@/components/site-pages/StaticRoutePage";

const page = footerPages.returnsAndCancellations;

export const metadata: Metadata = constructMetadata({
  title: page.title,
  description: page.description,
});

export default function Page() {
  return <StaticRoutePage title={page.title} description={page.description} />;
}
