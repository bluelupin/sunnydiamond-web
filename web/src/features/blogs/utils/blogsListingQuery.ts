import type { BlogCategory, BlogPost } from "../types";

export const BLOGS_INITIAL_VISIBLE = 9;
export const BLOGS_LOAD_MORE_STEP = 3;

type SearchParams = Record<string, string | string[] | undefined>;

export function filterBlogPosts(posts: BlogPost[], category: string): BlogPost[] {
  if (category === "all") {
    return posts;
  }

  return posts.filter((post) => post.category === category);
}

export function parseBlogsCategoryFromSearchParams(
  searchParams: SearchParams | undefined,
  categories: BlogCategory[],
): string {
  const validCategoryIds = new Set(categories.map((item) => item.id));

  const rawCategory =
    typeof searchParams?.category === "string" ? searchParams.category : "all";

  return rawCategory === "all" || validCategoryIds.has(rawCategory)
    ? rawCategory
    : "all";
}

/** True when URL has faceted listing params that should not be indexed. */
export function hasBlogsListingFilterParams(
  searchParams: SearchParams | undefined,
): boolean {
  return typeof searchParams?.category === "string" && searchParams.category.length > 0;
}

export function buildBlogsListingPath(
  searchParams: SearchParams | undefined,
): string {
  const category =
    typeof searchParams?.category === "string" ? searchParams.category.trim() : "";

  if (!category) {
    return "/blogs";
  }

  return `/blogs?category=${encodeURIComponent(category)}`;
}
