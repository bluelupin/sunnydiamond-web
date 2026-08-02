import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailPage from "@/features/blogs/components/BlogDetailPage";
import {
  getAllBlogSlugsForStaticParams,
  getBlogDetailBySlug,
} from "@/services/blogs/blogs.service";
import { constructMetadata } from "@/shared/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Refresh CMS-driven blog posts without a full redeploy. */
export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugsForStaticParams();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const result = await getBlogDetailBySlug(slug);

    if (!result) {
      return constructMetadata({
        title: "Blog",
        description: "Sunny Diamonds blog",
        canonicalPath: `/blogs/${slug}`,
      });
    }

    return constructMetadata({
      title: result.seo?.metaTitle ?? result.detail.title,
      description:
        result.seo?.metaDescription ??
        result.detail.introParagraphs[0] ??
        result.detail.title,
      canonicalPath: result.seo?.canonicalPath ?? `/blogs/${slug}`,
      ...(result.seo?.keywords ? { keywords: result.seo.keywords } : {}),
    });
  } catch {
    return constructMetadata({
      title: "Blog",
      description: "Sunny Diamonds blog",
      canonicalPath: `/blogs/${slug}`,
    });
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const result = await getBlogDetailBySlug(slug);

  if (!result) {
    notFound();
  }

  return (
    <BlogDetailPage detail={result.detail} relatedPosts={result.relatedPosts} />
  );
}
