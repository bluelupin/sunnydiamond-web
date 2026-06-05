import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import HomePageView from "@/features/cms/components/HomePage";
import { getHomepageShell } from "@/services/homepage/homepageShell.service";
import { buildHomepageJsonLd, resolveHomepageSeoMetadata } from "@/shared/lib/seo/homepageSeo";
import { siteConfig } from "@/shared/lib/siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const shellData = await getHomepageShell();
    const { title, description, canonicalUrl, imageUrl, noIndex } = resolveHomepageSeoMetadata(shellData);

    return constructMetadata({
      title,
      description,
      canonicalPath: canonicalUrl,
      image: imageUrl,
      url: canonicalUrl,
      noIndex,
    });
  } catch {
    return constructMetadata({
      title: "Sunny Diamonds",
      description: "Sunny Diamond - Premium Jewelry and Diamonds",
      canonicalPath: siteConfig.seo.siteUrl,
      url: siteConfig.seo.siteUrl,
    });
  }
}

export default async function Page() {
  const shellData = await getHomepageShell();
  const { title, description, canonicalUrl, imageUrl } = resolveHomepageSeoMetadata(shellData);

  return (
    <>
      <JsonLd data={buildHomepageJsonLd({ title, description, url: canonicalUrl, image: imageUrl })} />
      <HomePageView />
    </>
  );
}
