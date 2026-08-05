import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import BlogsPage from "@/features/blogs/components/BlogsPage";
import {
  buildBlogsListingPath,
  hasBlogsListingFilterParams,
} from "@/features/blogs/utils/blogsListingQuery";
import { getBlogsPageData } from "@/services/blogs/blogs.service";
import { mapStaticBlogsPage } from "@/services/blogs/blogs.mapper";

const page = footerPages.blogs;

/** Refresh CMS-driven blog listing without a full redeploy. */
export const revalidate = 300;

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const query = await searchParams;
  const noIndex = hasBlogsListingFilterParams(query);

  try {
    const blogsPage = await getBlogsPageData();
    return constructMetadata({
      title: blogsPage.seo?.metaTitle ?? page.title,
      description: blogsPage.seo?.metaDescription ?? page.description,
      canonicalPath: blogsPage.seo?.canonicalPath ?? "/blogs",
      noIndex,
      ...(blogsPage.seo?.keywords ? { keywords: blogsPage.seo.keywords } : {}),
      ...(blogsPage.seo?.ogImageUrl ? { image: blogsPage.seo.ogImageUrl } : {}),
    });
  } catch {
    return constructMetadata({
      title: page.title,
      description: page.description,
      canonicalPath: "/blogs",
      noIndex,
    });
  }
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  if (typeof resolvedSearchParams.limit === "string") {
    redirect(buildBlogsListingPath(resolvedSearchParams));
  }

  let blogsPage = mapStaticBlogsPage();

  try {
    blogsPage = await getBlogsPageData();
  } catch {
    blogsPage = mapStaticBlogsPage();
  }

  return <BlogsPage page={blogsPage} />;
}
