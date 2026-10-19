import type { Metadata } from "next";
import { Suspense } from "react";
import { footerPages } from "@/features/cms/data/footerPages";
import GiftCardPageLauncher from "@/features/gift-card/components/GiftCardPageLauncher";
import GiftingDocumentPreload from "@/features/gifting/components/GiftingDocumentPreload";
import GiftingPage from "@/features/gifting/components/GiftingPage";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import {
  EMPTY_GIFTING_PAGE,
  getGiftingPage,
} from "@/services/gifting/gifting-page.service";

export const revalidate = 300;

const fallback = footerPages.gifting;

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Gift Card",
    description: fallback.description,
    canonicalPath: "/gift-card",
  });
}

async function GiftCardPageContent() {
  const page = await getGiftingPage();
  return (
    <>
      <GiftingDocumentPreload page={page} />
      <GiftingPage page={page} />
      <GiftCardPageLauncher />
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <>
          <GiftingPage page={EMPTY_GIFTING_PAGE} />
          <GiftCardPageLauncher />
        </>
      }
    >
      <GiftCardPageContent />
    </Suspense>
  );
}
