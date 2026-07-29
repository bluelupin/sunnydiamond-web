import { blogsPageContent } from "./content";
import { blogDetailsBySlug } from "./detailContent";
import type { BlogDetail, BlogPost } from "../types";

function slugFromHref(href: string): string {
  return href.replace(/^\/blogs\//, "");
}

function createFallbackDetail(post: BlogPost): BlogDetail {
  const slug = slugFromHref(post.href);

  return {
    slug,
    title: post.title,
    author: "By Sunny Diamonds",
    date: post.date,
    readTime: post.readTime,
    heroImage: { src: post.imageSrc, alt: post.imageAlt },
    introParagraphs: [
      "Explore expert guidance from Sunny Diamonds on choosing, styling, and caring for diamond jewellery.",
    ],
    tableOfContents: [],
    sections: [],
    relatedPostIds: blogsPageContent.posts
      .filter((item) => item.id !== post.id)
      .slice(0, 3)
      .map((item) => item.id),
  };
}

function createFeaturedFallbackDetail(): BlogDetail {
  const featured = blogsPageContent.featured;
  const slug = slugFromHref(featured.href);

  return {
    slug,
    title: featured.title,
    author: "By Sunny Diamonds",
    date: featured.date,
    readTime: featured.readTime,
    heroImage: { src: featured.imageSrc, alt: featured.imageAlt },
    introParagraphs: [featured.excerpt],
    tableOfContents: [],
    sections: [],
    relatedPostIds: blogsPageContent.posts.slice(0, 3).map((post) => post.id),
  };
}

export function getAllBlogSlugs(): string[] {
  const postSlugs = blogsPageContent.posts.map((post) => slugFromHref(post.href));
  const featuredSlug = slugFromHref(blogsPageContent.featured.href);
  const detailSlugs = Object.keys(blogDetailsBySlug);

  return Array.from(new Set([...postSlugs, featuredSlug, ...detailSlugs]));
}

export function getBlogDetail(slug: string): BlogDetail | null {
  const fullDetail = blogDetailsBySlug[slug];
  if (fullDetail) {
    return fullDetail;
  }

  const post = blogsPageContent.posts.find(
    (item) => slugFromHref(item.href) === slug,
  );
  if (post) {
    return createFallbackDetail(post);
  }

  const featuredSlug = slugFromHref(blogsPageContent.featured.href);
  if (slug === featuredSlug) {
    return createFeaturedFallbackDetail();
  }

  return null;
}

export function getRelatedPosts(detail: BlogDetail): BlogPost[] {
  const postsById = new Map(
    blogsPageContent.posts.map((post) => [post.id, post]),
  );

  return detail.relatedPostIds
    .map((id) => postsById.get(id))
    .filter((post): post is BlogPost => Boolean(post));
}
