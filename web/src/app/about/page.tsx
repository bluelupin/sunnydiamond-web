import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import AboutPageView from "@/features/cms/components/AboutPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.about.title,
  description: seoContent.about.description,
});

export default function Page() {
  return <AboutPageView />;
}
