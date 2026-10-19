import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import GiftingDocumentPreload from "@/features/gifting/components/GiftingDocumentPreload";
import GiftingPage from "@/features/gifting/components/GiftingPage";
import {
  EMPTY_GIFTING_PAGE,
  getGiftingPage,
} from "@/services/gifting/gifting-page.service";
import { resolveGiftingSeoMetadata } from "@/shared/lib/seo/giftingSeo";

export const revalidate = 300;

const fallback = footerPages.gifting;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getGiftingPage();
    const { title, description, canonicalPath, keywords, image } =
      resolveGiftingSeoMetadata(page);

    return constructMetadata({
      title,
      description,
      canonicalPath,
      ...(keywords ? { keywords } : {}),
      ...(image ? { image } : {}),
    });
  } catch {
    return constructMetadata({
      title: fallback.title,
      description: fallback.description,
      canonicalPath: "/gifting",
    });
  }
}

async function GiftingPageContent() {
  const page = await getGiftingPage();

  return (
    <>
      <GiftingDocumentPreload page={page} />
      <GiftingPage page={page} />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<GiftingPage page={EMPTY_GIFTING_PAGE} />}>
      <GiftingPageContent />
    </Suspense>
  );
}
