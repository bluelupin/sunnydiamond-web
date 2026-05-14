import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { seoContent } from "@/data/content";
import HomePageView from "@/components/site-pages/HomePage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.home.title,
  description: seoContent.home.description,
});

export default function Page() {
  return <HomePageView />;
}
