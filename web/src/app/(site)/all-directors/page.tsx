import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { siteConfig } from "@/shared/lib/siteConfig";
import { allDirectorsPageContent } from "@/features/about/data/content";
import { ALL_DIRECTORS_PATH } from "@/features/about/constants/aboutRoutes";
import AllDirectorsPage from "@/features/about/components/AllDirectorsPage";
import AllDirectorsPageSkeleton from "@/features/about/components/skeletons/AllDirectorsPageSkeleton";
import { getAboutPage, EMPTY_ABOUT_PAGE } from "@/services/about/about-page.service";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const aboutPage = await getAboutPage();
    const title = allDirectorsPageContent.title;

    return constructMetadata({
      title: `${title} | ${siteConfig.brand.name}`,
      description:
        aboutPage.team?.description?.trim() ||
        siteConfig.seo.defaultDescription,
      canonicalPath: ALL_DIRECTORS_PATH,
    });
  } catch {
    return constructMetadata({
      title: `${allDirectorsPageContent.title} | ${siteConfig.brand.name}`,
      description: siteConfig.seo.defaultDescription,
      canonicalPath: ALL_DIRECTORS_PATH,
    });
  }
}

async function AllDirectorsPageContent() {
  let team = EMPTY_ABOUT_PAGE.team;

  try {
    const page = await getAboutPage();
    team = page.team;
  } catch {
    team = null;
  }

  return <AllDirectorsPage team={team} />;
}

export default function Page() {
  return (
    <Suspense fallback={<AllDirectorsPageSkeleton />}>
      <AllDirectorsPageContent />
    </Suspense>
  );
}
