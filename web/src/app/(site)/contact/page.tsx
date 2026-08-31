import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { siteConfig } from "@/shared/lib/siteConfig";
import ContactPageView from "@/features/contact/components/ContactPage";
import ContactPageSkeleton from "@/features/contact/components/skeletons/ContactPageSkeleton";
import { preloadPlpHeroLcpImages } from "@/lib/preloadPlpHeroLcpImages";
import { getContactPage } from "@/services/contact/contact-page.service";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getContactPage();
    const seo = page.seo;

    if (!seo?.metaTitle && !seo?.metaDescription) {
      return constructMetadata({
        title: siteConfig.brand.name,
        description: siteConfig.seo.defaultDescription,
        canonicalPath: "/contact",
      });
    }

    return constructMetadata({
      title: seo.metaTitle ?? siteConfig.brand.name,
      description: seo.metaDescription ?? siteConfig.seo.defaultDescription,
      ...(seo.canonicalPath ? { canonicalPath: seo.canonicalPath } : {}),
      ...(seo.metaKeywords ? { keywords: seo.metaKeywords } : {}),
      ...(seo.ogImageUrl ? { image: seo.ogImageUrl } : {}),
    });
  } catch {
    return constructMetadata({
      title: siteConfig.brand.name,
      description: siteConfig.seo.defaultDescription,
      canonicalPath: "/contact",
    });
  }
}

async function ContactPageContent() {
  const page = await getContactPage();

  preloadPlpHeroLcpImages({
    desktopUrl: page.hero?.image?.desktopUrl,
    mobileUrl: page.hero?.image?.mobileUrl,
  });

  return <ContactPageView page={page} />;
}

export default function Page() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactPageContent />
    </Suspense>
  );
}
