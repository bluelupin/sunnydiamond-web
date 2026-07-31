import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import BlogsPage from "@/features/blogs/components/BlogsPage";
import { getBlogsPageData } from "@/services/blogs/blogs.service";
import { mapStaticBlogsPage } from "@/services/blogs/blogs.mapper";

const page = footerPages.blogs;

/** Refresh CMS-driven blog listing without a full redeploy. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const blogsPage = await getBlogsPageData();
    return constructMetadata({
      title: blogsPage.seo?.metaTitle ?? page.title,
      description: blogsPage.seo?.metaDescription ?? page.description,
      canonicalPath: blogsPage.seo?.canonicalPath ?? "/blogs",
      ...(blogsPage.seo?.keywords ? { keywords: blogsPage.seo.keywords } : {}),
      ...(blogsPage.seo?.ogImageUrl ? { image: blogsPage.seo.ogImageUrl } : {}),
    });
  } catch {
    return constructMetadata({
      title: page.title,
      description: page.description,
      canonicalPath: "/blogs",
    });
  }
}

export default async function Page() {
  let blogsPage = mapStaticBlogsPage();

  try {
    blogsPage = await getBlogsPageData();
  } catch {
    blogsPage = mapStaticBlogsPage();
  }

  return <BlogsPage page={blogsPage} />;
}
