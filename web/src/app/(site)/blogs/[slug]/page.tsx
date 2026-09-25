import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailPage from "@/features/blogs/components/BlogDetailPage";
import {
  getAllBlogSlugsForStaticParams,
  getBlogDetailBySlug,
} from "@/services/blogs/blogs.service";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { getAbsoluteUrl } from "@/shared/lib/seo/siteConfig";
import JsonLd from "@/shared/lib/seo/JsonLd";

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
      canonicalPath: `/blogs/${slug}`,
      ...(result.seo?.keywords ? { keywords: result.seo.keywords } : {}),
      ...(result.seo?.ogImageUrl ? { image: result.seo.ogImageUrl } : {}),
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

  const { detail } = result;
  const articleUrl = getAbsoluteUrl(`/blogs/${encodeURIComponent(detail.slug)}`);
  const imageUrl = detail.heroImage.desktopUrl ?? detail.heroImage.mobileUrl;
  const articleMarkup = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: detail.title,
    mainEntityOfPage: articleUrl,
    author: detail.authorName
      ? { "@type": "Person", name: detail.authorName }
      : { "@type": "Organization", name: "Sunny Diamonds" },
    publisher: { "@type": "Organization", name: "Sunny Diamonds" },
    ...(detail.publishedDate ? { datePublished: detail.publishedDate } : {}),
    ...(imageUrl ? { image: getAbsoluteUrl(imageUrl) } : {}),
  };

  return (
    <>
      <JsonLd id="blog-posting-jsonld" data={articleMarkup} />
      <BlogDetailPage detail={detail} relatedPosts={result.relatedPosts} />
    </>
  );
}
