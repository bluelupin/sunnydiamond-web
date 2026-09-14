import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import GiftingGiftCardFlowRoot from "@/features/gift-card/components/GiftingGiftCardFlowRoot";
import GiftingPage from "@/features/gifting/components/GiftingPage";
import {
  EMPTY_GIFTING_PAGE,
  getGiftingPage,
} from "@/services/gifting/gifting-page.service";

export const revalidate = 300;

const fallback = footerPages.gifting;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGiftingPage();
  const seo = page.seo;

  return constructMetadata({
    title: seo?.metaTitle || page.hero?.title || fallback.title,
    description: seo?.metaDescription || fallback.description,
    canonicalPath: seo?.canonicalPath || "/gifting",
    ...(seo?.metaKeywords ? { keywords: seo.metaKeywords } : {}),
    ...(seo?.ogImageUrl ? { image: seo.ogImageUrl } : {}),
  });
}

async function GiftingPageContent() {
  const page = await getGiftingPage();
  return (
    <GiftingGiftCardFlowRoot>
      <GiftingPage page={page} />
    </GiftingGiftCardFlowRoot>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <GiftingGiftCardFlowRoot>
          <GiftingPage page={EMPTY_GIFTING_PAGE} />
        </GiftingGiftCardFlowRoot>
      }
    >
      <GiftingPageContent />
    </Suspense>
  );
}
