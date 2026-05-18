import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/lib/seo/metadata";
import { blogs } from "@/data/blogs";
import BlogDetailPage from "@/components/site-pages/BlogDetailPage";

export function generateStaticParams() {
  return blogs.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogs.find((item) => item.slug === params.slug);

  if (!post) {
    return constructMetadata({
      title: "Blog",
      description: "Blog detail placeholder.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: post.title,
    description: post.excerpt,
  });
}

export default function Page({ params }: { params: { slug: string } }) {
  const post = blogs.find((item) => item.slug === params.slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailPage post={post} />;
}
