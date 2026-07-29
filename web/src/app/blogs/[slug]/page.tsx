import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailPage from "@/features/blogs/components/BlogDetailPage";
import {
  getAllBlogSlugs,
  getBlogDetail,
  getRelatedPosts,
} from "@/features/blogs/data/getBlogDetail";
import { constructMetadata } from "@/shared/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = getBlogDetail(slug);

  if (!detail) {
    return constructMetadata({
      title: "Blog",
      description: "Sunny Diamonds blog",
      canonicalPath: `/blogs/${slug}`,
    });
  }

  return constructMetadata({
    title: detail.title,
    description: detail.introParagraphs[0] ?? detail.title,
    canonicalPath: `/blogs/${slug}`,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const detail = getBlogDetail(slug);

  if (!detail) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(detail);

  return <BlogDetailPage detail={detail} relatedPosts={relatedPosts} />;
}
