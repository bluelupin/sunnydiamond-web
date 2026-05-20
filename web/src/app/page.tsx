import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import HomePageView from "@/features/cms/components/HomePage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.home.title,
  description: seoContent.home.description,
});

export default function Page() {
  return <HomePageView />;
}
