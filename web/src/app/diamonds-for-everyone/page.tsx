import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import DiamondsForEveryonePage from "@/features/diamonds-for-everyone/components/DiamondsForEveryonePage";
import { footerPages } from "@/features/cms/data/footerPages";
import {
  EMPTY_DIAMONDS_FOR_EVERYONE_PAGE,
  getDiamondsForEveryonePage,
} from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.service";

export const revalidate = 300;

const fallback = footerPages.diamondsForEveryone;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDiamondsForEveryonePage();
  const seo = page.seo;

  return constructMetadata({
    title: seo?.metaTitle || page.hero?.title || fallback.title,
    description: seo?.metaDescription || fallback.description,
    canonicalPath: seo?.canonicalPath || "/diamonds-for-everyone",
    ...(seo?.metaKeywords ? { keywords: seo.metaKeywords } : {}),
    ...(seo?.ogImageUrl ? { image: seo.ogImageUrl } : {}),
  });
}

async function DiamondsForEveryonePageContent() {
  const page = await getDiamondsForEveryonePage();
  return <DiamondsForEveryonePage page={page} />;
}

export default function Page() {
  return (
    <Suspense fallback={<DiamondsForEveryonePage page={EMPTY_DIAMONDS_FOR_EVERYONE_PAGE} />}>
      <DiamondsForEveryonePageContent />
    </Suspense>
  );
}
