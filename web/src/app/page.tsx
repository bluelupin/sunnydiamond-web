import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import HomePageView from "@/features/cms/components/HomePage";
import { getHomepageContent } from "@/services/homepage.service";

export const metadata: Metadata = constructMetadata({
  title: seoContent.home.title,
  description: seoContent.home.description,
});

export default async function Page() {
  const homepageData = await getHomepageContent();

  return <HomePageView homeData={homepageData} />;
}
