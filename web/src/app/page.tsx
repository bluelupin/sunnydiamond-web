import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import HomePageView from "@/features/cms/components/HomePage";
import HomepageCmsSeeder from "@/shared/lib/providers/HomepageCmsSeeder";
import {
  getCachedHomepageShell,
  prefetchHomepageCms,
} from "@/lib/homepage/prefetchHomepageCms";
import { buildHomepageJsonLd, resolveHomepageSeoMetadata } from "@/shared/lib/seo/homepageSeo";
import { siteConfig } from "@/shared/lib/siteConfig";

/** Refresh CMS-driven homepage content without a full redeploy. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const shellData = await getCachedHomepageShell();
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
  const prefetchedCms = await prefetchHomepageCms();
  const { title, description, canonicalUrl, imageUrl } = resolveHomepageSeoMetadata(
    prefetchedCms.shell ?? {},
  );

  return (
    <>
      <HomepageCmsSeeder
        shell={prefetchedCms.shell}
        editorial={prefetchedCms.editorial}
        shopping={prefetchedCms.shopping}
      />
      <JsonLd data={buildHomepageJsonLd({ title, description, url: canonicalUrl, image: imageUrl })} />
      <HomePageView />
    </>
  );
}
