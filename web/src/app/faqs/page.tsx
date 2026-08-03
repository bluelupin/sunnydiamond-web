import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import SupportPage from "@/features/support/components/SupportPage";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { buildFaqPageJsonLd } from "@/shared/lib/seo/schema/faqPage";
import {
  EMPTY_SUPPORT_PAGE,
  getSupportPage,
} from "@/services/support/support-page.service";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSupportPage();
  const seo = page.seo;

  return constructMetadata({
    title: seo?.metaTitle || page.title || "",
    description: seo?.metaDescription || page.subtitle || undefined,
    canonicalPath: seo?.canonicalPath || "/faqs",
    ...(seo?.metaKeywords ? { keywords: seo.metaKeywords } : {}),
    ...(seo?.ogImageUrl ? { image: seo.ogImageUrl } : {}),
  });
}

async function SupportPageContent() {
  const page = await getSupportPage();
  const faqJsonLd =
    page.faq && page.faq.items.length > 0
      ? buildFaqPageJsonLd(
          page.faq.items.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        )
      : null;

  return (
    <>
      {faqJsonLd ? <JsonLd data={faqJsonLd} id="support-faq-jsonld" /> : null}
      <SupportPage page={page} />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SupportPage page={EMPTY_SUPPORT_PAGE} />}>
      <SupportPageContent />
    </Suspense>
  );
}
