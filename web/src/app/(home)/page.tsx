import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import HomePageView from "@/features/cms/components/HomePage";
import { HomepageCmsProvider } from "@/shared/lib/providers/HomepageCmsProvider";
import {
  getCachedHomepageShell,
  prefetchHomepageBundle,
} from "@/lib/homepage/prefetchHomepageCms";
import {
  preloadHeroLcpImages,
  resolveCraftingRarityContent,
  resolveHeroContent,
} from "@/lib/homepage/resolveHomepageAboveFold";
import { buildHomepageJsonLd, resolveHomepageSeoMetadata } from "@/shared/lib/seo/homepageSeo";
import { siteConfig } from "@/shared/lib/siteConfig";

/** Matches HOMEPAGE_CMS_REVALIDATE_SECONDS — segment config must be a literal. */
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
  const prefetched = await prefetchHomepageBundle();
  const hero = resolveHeroContent(prefetched.shell);
  const craftingRarity = resolveCraftingRarityContent(
    prefetched.shell,
    prefetched.editorial,
    prefetched.shopping,
  );

  preloadHeroLcpImages(hero);

  const { title, description, canonicalUrl, imageUrl } = resolveHomepageSeoMetadata(
    prefetched.shell ?? {},
  );

  return (
    <HomepageCmsProvider
      shell={prefetched.shell}
      editorial={prefetched.editorial}
      shopping={prefetched.shopping}
      standaloneOccasions={prefetched.standaloneOccasions}
      alankara={prefetched.alankara}
    >
      <JsonLd data={buildHomepageJsonLd({ title, description, url: canonicalUrl, image: imageUrl })} />
      <HomePageView hero={hero} craftingRarity={craftingRarity} />
    </HomepageCmsProvider>
  );
}
