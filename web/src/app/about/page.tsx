import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { seoContent } from "@/data/content";
import AboutPageView from "@/components/site-pages/AboutPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.about.title,
  description: seoContent.about.description,
});

export default function Page() {
  return <AboutPageView />;
}
