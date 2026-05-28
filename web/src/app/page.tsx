import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import HomePageView from "@/features/cms/components/HomePage";
import { getHomepageSeo } from "@/services/homepage/seo.service";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getHomepageSeo();
    const seo = data?.seo ?? null;

    const title = seo?.metaTitle?.trim();
    const description = seo?.metaDescription?.trim();
    const canonicalPath = seo?.canonicalURL ?? undefined;
    const image = getCmsAssetUrl(seo?.shareImage?.data?.attributes?.url);

    if (!title || !description) {
      return constructMetadata({ title: "Sunny Diamonds", description: "Sunny Diamond - Premium Jewelry and Diamonds" });
    }

    return constructMetadata({
      title,
      description,
      image: image ?? undefined,
      canonicalPath: canonicalPath ?? undefined,
      noIndex: seo?.noIndex === true,
    });
  } catch {
    return constructMetadata({ title: "Sunny Diamonds", description: "Sunny Diamond - Premium Jewelry and Diamonds" });
  }
}

export default async function Page() {
  return <HomePageView />;
}
