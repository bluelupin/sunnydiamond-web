import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import ContactPageView from "@/features/contact/components/ContactPage";
import {
  EMPTY_CONTACT_PAGE,
  getContactPage,
} from "@/services/contact/contact-page.service";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  const seo = page.seo;

  return constructMetadata({
    title: seo?.metaTitle || page.hero.title || seoContent.contact.title,
    description:
      seo?.metaDescription || page.intro.description || seoContent.contact.description,
    canonicalPath: seo?.canonicalPath || "/contact",
    ...(seo?.metaKeywords ? { keywords: seo.metaKeywords } : {}),
    ...(seo?.ogImageUrl ? { image: seo.ogImageUrl } : {}),
  });
}

async function ContactPageContent() {
  const page = await getContactPage();
  return <ContactPageView page={page} />;
}

export default function Page() {
  return (
    <Suspense fallback={<ContactPageView page={EMPTY_CONTACT_PAGE} />}>
      <ContactPageContent />
    </Suspense>
  );
}
