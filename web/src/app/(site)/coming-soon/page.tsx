import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import StaticRoutePage from "@/features/cms/components/StaticRoutePage";

export const metadata: Metadata = constructMetadata({
  title: "Search Coming Soon",
  description:
    "Product search is coming soon to Sunny Diamonds. Browse our collections and bespoke jewellery in the meantime.",
  canonicalPath: "/coming-soon",
  noIndex: true,
});

export default function Page() {
  return (
    <StaticRoutePage
      title="Search Coming Soon"
      description="We're building a better way to discover our jewellery. Explore collections from the homepage or visit a showroom until search launches."
    />
  );
}
